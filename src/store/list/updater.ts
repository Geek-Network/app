import { nanoid } from '@reduxjs/toolkit';
import { useCallback, useEffect } from 'react';
import { useNetwork } from 'wagmi';
import { fetchTokenList } from '.';
import { useDispatch } from '..';
import getTokenList from '../../hooks/useFetchListCallback';
import useFetchListCallback from '../../hooks/useFetchListCallback';
import useInterval from '../../hooks/useInterval';
import { useActiveListUrls, useAllLists } from '../../hooks/useList';

export default function Updater() {
    const { chain } = useNetwork();

    const dispatch = useDispatch();

    // get all loaded lists, and the active urls
    const lists = useAllLists();
    // const activeListUrls = useActiveListUrls();

    //  const fetchList = useFetchListCallback();
    // const fetchAllListsCallback = useCallback(() => {
    //     Object.keys(lists).forEach((url) => fetchList(url).catch((error) => console.debug('interval list fetching error', error)));
    // }, [fetchList, lists]);

    // useInterval(fetchAllListsCallback, chain ? 1000 * 60 * 10 : null);

    // whenever a list is not loaded and not loading, try again to load it
    useEffect(() => {
        Object.keys(lists).forEach((listUrl) => {
            const list = lists[listUrl];

            if (!list.current && !list.error) {
                //fetchList(listUrl).catch((error) => console.debug('list added fetching error', error));

                const requestId = nanoid();

                dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
                return getTokenList(listUrl)
                    .then((tokenList) => {
                        dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }));
                        return tokenList;
                    })
                    .catch((error) => {
                        console.debug(`Failed to get list at url ${listUrl}`, error);
                        dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }));
                        throw error;
                    });
            }
        });
    }, [dispatch]);

    return null;
}
