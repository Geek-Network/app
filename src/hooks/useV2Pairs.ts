import { computePairAddress, Currency, CurrencyAmount, FACTORY_ADDRESS, Pair } from '@sushiswap/core-sdk';
import { Interface } from 'ethers/lib/utils';
import { useMemo } from 'react';

import IUniswapV2PairABI from '@sushiswap/core/build/abi/IUniswapV2Pair.json';
import { useContractReads, useNetwork } from 'wagmi';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export enum PairState {
    LOADING,
    NOT_EXISTS,
    EXISTS,
    INVALID,
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
    //const {chain} = useNetwork();

    const tokens = useMemo(() => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]), [currencies]);

    const contracts = useMemo(
        () =>
            tokens.reduce<(any | undefined)[]>((acc, [tokenA, tokenB]) => {
                const address =
                    tokenA && tokenB && tokenA.chainId === tokenB.chainId && !tokenA.equals(tokenB) && FACTORY_ADDRESS[tokenA.chainId]
                        ? computePairAddress({
                              factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
                              tokenA,
                              tokenB,
                          })
                        : undefined;

                // acc.push(address && !acc.includes(address) ? address : undefined);

                acc.push({
                    addressOrName: address,
                    contractInterface: PAIR_INTERFACE,
                    functionName: 'getReserves',
                });
                return acc;
            }, []),
        [tokens]
    );

    // console.log('contracts', tokens);

    //const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

    const { data } = useContractReads({ contracts, cacheOnBlock: true });
    return useMemo(() => {
        // console.log('useV2Pairs', data, contracts);
        return data
            ? data.map((result, i) => {
                  const tokenA = tokens[i][0];
                  const tokenB = tokens[i][1];
                  if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
                  if (!result) return [PairState.NOT_EXISTS, null];
                  const { reserve0, reserve1 } = result;
                  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
                  return [PairState.EXISTS, new Pair(CurrencyAmount.fromRawAmount(token0, reserve0.toString()), CurrencyAmount.fromRawAmount(token1, reserve1.toString()))];
              })
            : [[PairState.LOADING, null]];
    }, [data, tokens]);

    // const { isLoading, data } = useContractReads({ contracts });

    // return useMemo(() => {
    //     // console.log('useV2Pairs', data, contracts);
    //     return isLoading || !data
    //         ? [[PairState.LOADING, null]]
    //         : data.map((result, i) => {
    //               const tokenA = tokens[i][0];
    //               const tokenB = tokens[i][1];
    //               if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
    //               if (!result) return [PairState.NOT_EXISTS, null];
    //               const { reserve0, reserve1 } = result;
    //               const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    //               return [PairState.EXISTS, new Pair(CurrencyAmount.fromRawAmount(token0, reserve0.toString()), CurrencyAmount.fromRawAmount(token1, reserve1.toString()))];
    //           });
    // }, [data, isLoading, tokens]);
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
    const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB]);
    return useV2Pairs(inputs)[0];
}
