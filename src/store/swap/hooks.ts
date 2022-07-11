import { ChainId, Currency, NATIVE, Percent, SUSHI, Trade, TradeType } from '@sushiswap/core-sdk';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import { setCurrency, switchCurrencies, setAmount, setRecipient, setCurrencies } from '.';
import { RootState, useDispatch, useSelector } from '..';
import { Field } from '../../constants';
import { tryParseAmount } from '../../helper';
import { useCurrency } from '../../hooks/useCurrency';
import { useTradeExactIn, useTradeExactOut } from '../../hooks/useV2Trades';

const getToken = (urlToken: string | undefined | null, chainId: ChainId | undefined) => {
    if (!urlToken || !chainId) return undefined;
    return [NATIVE[chainId].symbol, 'ETH'].includes(urlToken) ? 'ETH' : urlToken;
};

export function useSlippageTolerance(): Percent {
    const slippage = useSelector((state: RootState) => state.user.slippage);

    const parse = Math.floor(Number.parseFloat(slippage) * 100);

    return new Percent(parse, 10_000);
}

export default function useSwap(): {
    currencies: (Currency | undefined)[];
    amounts: (string | number | undefined)[];
    onCurrencySelection: (field: Field, currency: Currency) => void;
    onSwitchCurrencies: () => void;
    onChangeAmount: (field: Field, amount: number) => void;
    onChangeRecipient: (recipient?: string) => void;
    trade: Trade<Currency, Currency, TradeType> | undefined | null;
} {
    const dispatch = useDispatch();

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const [searchParams, setSearchParams] = useSearchParams();
    // useCurrency('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

    const currencyA = useCurrency(getToken(searchParams.get('from'), chainId)) || (chainId && NATIVE[chainId]) || undefined;

    const currencyB = useCurrency(getToken(searchParams.get('to'), chainId)) || (chainId && SUSHI[chainId]) || undefined;

    const singleHopOnly = useSelector((state: RootState) => state.user.singleHopOnly);

    const { currencies, amount, field } = useSelector((state: RootState) => state.swap);    

    const isExactIn: boolean = field === Field.INPUT;

    const parsedAmount = tryParseAmount(amount?.toString(), (isExactIn ? currencies[0] : currencies[1]) ?? undefined);

    const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, currencies[1] ?? undefined, {
        maxHops: singleHopOnly ? 1 : undefined,
    });

    const bestTradeExactOut = useTradeExactOut(currencies[0] ?? undefined, !isExactIn ? parsedAmount : undefined, {
        maxHops: singleHopOnly ? 1 : undefined,
    });
    const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

    console.log('useSwap', field, amount, trade?.inputAmount.toExact(), trade?.outputAmount.toExact(), trade?.priceImpact.toFixed());

    const amounts = useMemo(() => [field === Field.INPUT ? amount : trade?.inputAmount.toExact(), field === Field.OUTPUT ? amount : trade?.outputAmount.toExact()], [field, amount, trade]);

    const onCurrencySelection = useCallback(
        (field: Field, currency: Currency | undefined) => {
            searchParams.set(field === Field.INPUT ? 'from' : 'to', currency?.isNative ? NATIVE[chainId].symbol : currency?.wrapped.address);
            setSearchParams(searchParams);
            dispatch(setCurrency({ field, currency }));
        },
        [dispatch, chainId, searchParams, setSearchParams]
    );

    const onSwitchCurrencies = useCallback(() => {
        const nativeSymbol = NATIVE[chainId].symbol;

        searchParams.set('from', currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address);
        searchParams.set('to', currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address);
        setSearchParams(searchParams);

        dispatch(switchCurrencies());
    }, [dispatch, searchParams, setSearchParams, chainId, currencyA?.isNative, currencyA?.wrapped.address, currencyB?.isNative, currencyB?.wrapped.address]);

    const onChangeAmount = useCallback(
        (field: Field, amount: number) => {
            dispatch(setAmount({ field, amount }));
        },
        [dispatch]
    );

    const onChangeRecipient = useCallback(
        (recipient?: string) => {
            dispatch(setRecipient(recipient));
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(setCurrencies([currencyA, currencyB]));
        // onCurrencySelection(Field.INPUT, currencyA);
        // onCurrencySelection(Field.OUTPUT, currencyB);

        // dispatch(setCurrency({ field: Field.INPUT, currency: currencyA }));
        // dispatch(setCurrency({ field: Field.OUTPUT, currency: currencyB }));
    }, [chain]);

    return useMemo(
        () => ({
            currencies,
            amounts,
            onCurrencySelection,
            onSwitchCurrencies,
            onChangeAmount,
            onChangeRecipient,
            trade,
        }),
        [onCurrencySelection, onSwitchCurrencies, onChangeAmount, onChangeRecipient, trade, currencies, amounts]
    );
}
