import { ChainId, Currency, NATIVE, SUSHI, USDC } from '@sushiswap/core-sdk';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNetwork } from 'wagmi';
import { useCurrency } from './useCurrency';

const getToken = (urlToken: string | undefined | null, chainId: ChainId | undefined) => {
    if (!urlToken || !chainId) return undefined;
    return [NATIVE[chainId].symbol, 'ETH'].includes(urlToken) ? 'ETH' : urlToken;
};

const useCurrenciesFromURL = (): {
    currencies: (Currency | undefined)[];
    switchCurrencies: () => Promise<void>;
    setURLCurrency: (cur: Currency, isBase: boolean) => void;
    fee: number;
    twap: boolean;
} => {
    const { activeChain } = useNetwork();

    const [searchParams, setSearchParams] = useSearchParams();

    const chainId = activeChain?.id;

    const currencyA = useCurrency(getToken(searchParams.get('from'), chainId)) || (chainId && NATIVE[chainId]) || undefined;

    const currencyB = useCurrency(getToken(searchParams.get('to'), chainId)) || (chainId && USDC[chainId]) || undefined;

    const fee = Number(searchParams.get('fee') ?? 30);
    const twap = searchParams.get('twap') !== 'false';

    const switchCurrencies = useCallback(async () => {
        if (!chainId) return;

        const nativeSymbol = NATIVE[chainId].symbol;

        searchParams.set('from', currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address);
        searchParams.set('to', currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address);

        setSearchParams(searchParams);
    }, [chainId, currencyA?.isNative, currencyA?.wrapped.address, currencyB?.isNative, currencyB?.wrapped.address, searchParams, setSearchParams]);

    const setURLCurrency = useCallback(
        async (cur: Currency, isBase: boolean) => {
            if (!chainId) return;

            const nativeSymbol = NATIVE[chainId].symbol;

            searchParams.set(isBase ? 'from' : 'to', cur.isNative ? nativeSymbol : cur?.wrapped.address);

            setSearchParams(searchParams);
        },
        [chainId, searchParams, setSearchParams]
    );

    return useMemo(
        () => ({
            currencies: [currencyA, currencyB],
            setURLCurrency,
            switchCurrencies,
            fee,
            twap,
        }),
        [currencyA, currencyB, setURLCurrency, switchCurrencies, fee, twap]
    );
};

export default useCurrenciesFromURL;
