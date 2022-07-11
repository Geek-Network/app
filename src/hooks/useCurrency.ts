import { ChainId, Currency, NATIVE, Token, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/core-sdk';
import { useMemo } from 'react';
import { useNetwork, useToken } from 'wagmi';

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
    const { chain } = useNetwork();

    // Since this is used throughout the app, cant change this to NATIVE[chainId]?.symbol
    const isETH = currencyId?.toUpperCase() === 'ETH';

    const chainId = chain?.id as ChainId;

    const isDual = [ChainId.CELO].includes(chainId);

    const useNative = isETH && !isDual;

    if (isETH && isDual) {
        currencyId = WNATIVE_ADDRESS[chainId];
    }

    const { data } = useToken({ address: useNative ? undefined : currencyId });

    // console.log(data);

    const { native, wnative, token } = useMemo(
        () => ({
            native: chainId && chainId in NATIVE ? NATIVE[chainId] : undefined,
            wnative: chainId && chainId in WNATIVE ? WNATIVE[chainId] : undefined,
            token: data ? new Token(chainId, data.address, data.decimals, data.symbol) : undefined,
        }),
        [chainId, data]
    );

    if (wnative?.address?.toLowerCase() === currencyId?.toLowerCase()) return wnative;

    return useNative ? native : token;
}
