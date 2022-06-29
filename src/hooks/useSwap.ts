import { ChainId, Currency, NATIVE, USDC } from '@sushiswap/core-sdk';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import { Field } from '../constants';
import { useDispatch } from '../store';
import { setAmount, setCurrencies, setCurrency, setRecipient, switchCurrencies } from '../store/swap';
import { useCurrency } from './useCurrency';

const getToken = (urlToken: string | undefined | null, chainId: ChainId | undefined) => {
    if (!urlToken || !chainId) return undefined;
    return [NATIVE[chainId].symbol, 'ETH'].includes(urlToken) ? 'ETH' : urlToken;
};

export default function useSwap(): {
    onCurrencySelection: (field: Field, currency: Currency) => void;
    onSwitchCurrencies: () => void;
    onChangeAmount: (field: Field, amount: number) => void;
    onChangeRecipient: (recipient?: string) => void;
} {
    const dispatch = useDispatch();

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const [searchParams, setSearchParams] = useSearchParams();

    const currencyA = useCurrency(getToken(searchParams.get('from'), chainId)) || (chainId && NATIVE[chainId]) || undefined;

    const currencyB = useCurrency(getToken(searchParams.get('to'), chainId)) || (chainId && USDC[chainId]) || undefined;

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
    }, [dispatch, chainId]);

    return useMemo(
        () => ({
            // currencies: [currencyA, currencyB],
            onCurrencySelection,
            onSwitchCurrencies,
            onChangeAmount,
            onChangeRecipient,
        }),
        [onCurrencySelection, onSwitchCurrencies, onChangeAmount, onChangeRecipient]
    );
}
