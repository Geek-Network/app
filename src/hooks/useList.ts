import { useMemo } from 'react';
import { UNSUPPORTED_LIST_URLS } from '../constants/token-lists';
import { sortByListPriority } from '../helper';
import { combineMaps, TokenAddressMap, tokensToChainTokenMap } from '../helper/token';
import { RootState, useSelector } from '../store';

export function useAllLists(): RootState['lists']['byUrl'] {
    return useSelector((state) => state.lists.byUrl);
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
    const activeListUrls = useSelector((state) => state.lists.activeListUrls);
    // console.log(activeListUrls);
    return useMemo(() => activeListUrls?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url)), [activeListUrls]);
}

export function useInactiveListUrls(): string[] {
    const lists = useAllLists();
    const allActiveListUrls = useActiveListUrls();
    return useMemo(() => Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)), [lists, allActiveListUrls]);
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
    const lists = useAllLists();

   // console.log(lists);

    return useMemo(() => {
        if (!urls) return {};
        return (
            urls
                .slice()
                // sort by priority so top priority goes last
                .sort(sortByListPriority)
                .reduce((allTokens, currentUrl) => {
                    const current = lists[currentUrl]?.current;
                    if (!current) return allTokens;
                    try {
                        return combineMaps(allTokens, tokensToChainTokenMap(current));
                    } catch (error) {
                        console.error('Could not show token list due to error', error);
                        return allTokens;
                    }
                }, {})
        );
    }, [lists, urls]);
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
    const activeListUrls = useActiveListUrls();
    // console.log("useCombinedActiveList",activeListUrls );
    const activeTokens = useCombinedTokenMapFromUrls(activeListUrls);
    return activeTokens;
}
