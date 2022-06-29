import { TokenList, TokenInfo } from '@uniswap/token-lists';
import { WrappedTokenInfo } from './wrappedTokenInfo';

type TokenMap = Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList } }>;
export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>;

export type TokenAddressMap = ChainTokenMap;

type Mutable<T> = {
    -readonly [P in keyof T]: Mutable<T[P]>;
};

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>() : null;

const listCache: WeakMap<TokenList, TokenAddressMap> | null = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null;

export function tokensToChainTokenMap(tokens: TokenList | TokenInfo[]): ChainTokenMap {
    const cached = mapCache?.get(tokens);
    if (cached) return cached;

    const [list, infos] = Array.isArray(tokens) ? [undefined, tokens] : [tokens, tokens.tokens];
    const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
        const token = new WrappedTokenInfo(info, list);
        if (map[token.chainId]?.[token.address] !== undefined) {
            console.warn(`Duplicate token skipped: ${token.address}`);
            return map;
        }
        if (!map[token.chainId]) {
            map[token.chainId] = {};
        }
        map[token.chainId][token.address] = { token, list };
        return map;
    }, {}) as ChainTokenMap;
    mapCache?.set(tokens, map);
    return map;
}

export function listToTokenMap(list: TokenList): TokenAddressMap {
    const result = listCache?.get(list);
    if (result) return result;

    const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
        const token = new WrappedTokenInfo(tokenInfo, list);
        if (tokenMap[token.chainId]?.[token.address] !== undefined) {
            console.error(new Error(`Duplicate token! ${token.address}`));
            return tokenMap;
        }
        return {
            ...tokenMap,
            [token.chainId]: {
                ...tokenMap[token.chainId],
                [token.address]: {
                    token,
                    list,
                },
            },
        };
    }, {});
    listCache?.set(list, map);
    return map;
}

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
export function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
    const chainIds = Object.keys(
        Object.keys(map1)
            .concat(Object.keys(map2))
            .reduce<{ [chainId: string]: true }>((memo, value) => {
                memo[value] = true;
                return memo;
            }, {})
    ).map((id) => parseInt(id));

    return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
        memo[chainId] = {
            ...map2[chainId],
            // map1 takes precedence
            ...map1[chainId],
        };
        return memo;
    }, {}) as TokenAddressMap;
}
