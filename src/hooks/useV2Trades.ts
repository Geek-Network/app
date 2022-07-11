import { Currency, CurrencyAmount, Pair, Trade, TradeType } from '@sushiswap/core-sdk';
import { useMemo } from 'react';
import { BETTER_TRADE_LESS_HOPS_THRESHOLD, MAX_HOPS } from '../constants';
import { isTradeBetter } from '../helper/trade';
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations';
import { PairState, useV2Pairs } from './useV2Pairs';

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
    //console.log('useAllCommonPairs', currencyA, currencyB);

    const allCurrencyCombinations = useAllCurrencyCombinations(currencyA, currencyB);

  // console.log('allCurrencyCombinations', allCurrencyCombinations);

    const allPairs = useV2Pairs(allCurrencyCombinations);

    // only pass along valid pairs, non-duplicated pairs
    return useMemo(
        () =>
            Object.values(
                allPairs
                    // filter out invalid pairs
                    .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
                    // filter out duplicated pairs
                    .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
                        memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr;
                        return memo;
                    }, {})
            ),
        [allPairs]
    );
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount<Currency>, currencyOut?: Currency, { maxHops = MAX_HOPS } = {}): Trade<Currency, Currency, TradeType.EXACT_INPUT> | null {
    const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut);

   console.log('useTradeExactIn wrapped', currencyAmountIn?.currency, currencyOut, allowedPairs);

    // console.log(allowedPairs);

    //console.log('currencyIn', currencyOut, currencyAmountIn);

    return useMemo(() => {
        if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
            if (maxHops === 1) {
                return (
                    Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
                        maxHops: 1,
                        maxNumResults: 1,
                    })[0] ?? null
                );
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar: Trade<Currency, Currency, TradeType.EXACT_INPUT> | null = null;
            for (let i = 1; i <= maxHops; i++) {
                const currentTrade: Trade<Currency, Currency, TradeType.EXACT_INPUT> | null =
                    Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
                        maxHops: i,
                        maxNumResults: 1,
                    })[0] ?? null;
                // if current trade is best yet, save it
                if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade;
                }
            }
            return bestTradeSoFar;
        }

        return null;
    }, [allowedPairs, currencyAmountIn, currencyOut, maxHops]);
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount<Currency>, { maxHops = MAX_HOPS } = {}): Trade<Currency, Currency, TradeType.EXACT_OUTPUT> | null {
    const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency);

   console.log('useTradeExactOut', currencyAmountOut?.currency, currencyIn, allowedPairs);

    //console.log('allowedPairs', allowedPairs)

    return useMemo(() => {
        if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
            if (maxHops === 1) {
                return (
                    Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
                        maxHops: 1,
                        maxNumResults: 1,
                    })[0] ?? null
                );
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar: Trade<Currency, Currency, TradeType.EXACT_OUTPUT> | null = null;
            for (let i = 1; i <= maxHops; i++) {
                const currentTrade =
                    Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
                        maxHops: i,
                        maxNumResults: 1,
                    })[0] ?? null;
                if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade;
                }
            }
            return bestTradeSoFar;
        }
        return null;
    }, [currencyIn, currencyAmountOut, allowedPairs, maxHops]);
}
