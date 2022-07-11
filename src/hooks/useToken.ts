import { Token } from '@sushiswap/core-sdk';
import { isAddress } from 'ethers/lib/utils';

import { useMemo } from 'react';
import { TokenAddressMap } from '../helper/token';
import { useCombinedActiveList } from './useList';


// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
    const { chainId } = useActiveWeb3React();
    const userAddedTokens = useUserAddedTokens();

    return useMemo(() => {
        if (!chainId) return {};

        // reduce to just tokens
        const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>((newMap, address) => {
            newMap[address] = tokenMap[chainId][address].token;
            return newMap;
        }, {});

        if (includeUserAdded) {
            return (
                userAddedTokens
                    // reduce into all ALL_TOKENS filtered by the current chain
                    .reduce<{ [address: string]: Token }>(
                        (tokenMap, token) => {
                            tokenMap[token.address] = token;
                            return tokenMap;
                        },
                        // must make a copy because reduce modifies the map, and we do not
                        // want to make a copy in every iteration
                        { ...mapWithoutUrls }
                    )
            );
        }

        return mapWithoutUrls;
    }, [chainId, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useAllTokens(): { [address: string]: Token } {
    const allTokens = useCombinedActiveList();    
    return useTokensFromMap(allTokens, true);
}

export function useTokens(): { [address: string]: Token } {
    const allTokens = useCombinedActiveList();
    return useTokensFromMap(allTokens, false);
}
