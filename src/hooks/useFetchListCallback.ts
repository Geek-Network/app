import { nanoid } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';
import { useCallback } from 'react';
import { uriToHttp } from '../helper';
import validateTokenList from '../helper/validateTokenList';
import { useDispatch } from '../store';
import { fetchTokenList } from '../store/list';

const listCache = new Map<string, TokenList>();

/** Fetches and validates a token list. */
export default async function getTokenList(listUrl: string): Promise<TokenList> {
    const cached = listCache?.get(listUrl); // avoid spurious re-fetches
    if (cached) {
        return cached;
    }

     let urls: string[];
    // const parsedENS = parseENSAddress(listUrl);
    // if (parsedENS) {
    //     let contentHashUri;
    //     try {
    //         contentHashUri = await resolveENSContentHash(parsedENS.ensName);
    //     } catch (error) {
    //         const message = `failed to resolve ENS name: ${parsedENS.ensName}`;
    //         console.debug(message, error);
    //         throw new Error(message);
    //     }
    //     let translatedUri;
    //     try {
    //         translatedUri = contenthashToUri(contentHashUri);
    //     } catch (error) {
    //         const message = `failed to translate contenthash to URI: ${contentHashUri}`;
    //         console.debug(message, error);
    //         throw new Error(message);
    //     }
    //     urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`);
    // } else {
    //     urls = uriToHttp(listUrl);
    // }

    urls = uriToHttp(listUrl);
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const isLast = i === urls.length - 1;
        let response;
        try {
            response = await fetch(url, { credentials: 'omit' });
        } catch (error) {
            const message = `failed to fetch list: ${listUrl}`;
            console.debug(message, error);
            if (isLast) throw new Error(message);
            continue;
        }

        if (!response.ok) {
            const message = `failed to fetch list: ${listUrl}`;
            console.debug(message, response.statusText);
            if (isLast) throw new Error(message);
            continue;
        }

        const json = await response.json();
        const list = await validateTokenList(json);
        listCache?.set(listUrl, list);
        return list;
    }

    throw new Error('Unrecognized list URL protocol.');
}

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
    // const { chainId, library } = useActiveWeb3React();
    const dispatch = useDispatch();

    // const ensResolver = useCallback(
    //   async (ensName: string) => {
    //     if (!library || chainId !== 1) {
    //       const networkLibrary = getNetworkLibrary()
    //       const network = await networkLibrary.getNetwork()
    //       if (networkLibrary && network.chainId === 1) {
    //         return resolveENSContentHash(ensName, networkLibrary)
    //       }
    //       throw new Error('Could not construct mainnet ENS resolver')
    //     }
    //     return resolveENSContentHash(ensName, library)
    //   },
    //   [chainId, library]
    // )

    // note: prevent dispatch if using for list search or unsupported list
    return useCallback(
        async (listUrl: string, sendDispatch = true) => {
            const requestId = nanoid();
            sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
            return getTokenList(listUrl)
                .then((tokenList) => {
                    sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }));
                    return tokenList;
                })
                .catch((error) => {
                    console.debug(`Failed to get list at url ${listUrl}`, error);
                    sendDispatch && dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }));
                    throw error;
                });
        },
        [dispatch]
    );
}
