import { ActionCreatorWithPayload, createAction, createSlice } from '@reduxjs/toolkit';
import { getVersionUpgrade, TokenList, VersionUpgrade } from '@uniswap/token-lists';
import { DEFAULT_ACTIVE_LIST_URLS, DEFAULT_LIST_OF_LISTS } from '../../constants/token-lists';

export const fetchTokenList: Readonly<{
    pending: ActionCreatorWithPayload<{ url: string; requestId: string }>;
    fulfilled: ActionCreatorWithPayload<{ url: string; tokenList: TokenList; requestId: string }>;
    rejected: ActionCreatorWithPayload<{ url: string; errorMessage: string; requestId: string }>;
}> = {
    pending: createAction('lists/fetchTokenList/pending'),
    fulfilled: createAction('lists/fetchTokenList/fulfilled'),
    rejected: createAction('lists/fetchTokenList/rejected'),
};
// add and remove from list options
export const addList = createAction<string>('lists/addList');
export const removeList = createAction<string>('lists/removeList');

// select which lists to search across from loaded lists
export const enableList = createAction<string>('lists/enableList');
export const disableList = createAction<string>('lists/disableList');

// versioning
export const acceptListUpdate = createAction<string>('lists/acceptListUpdate');

export interface ListsState {
    readonly byUrl: {
        readonly [url: string]: {
            readonly current: TokenList | null;
            readonly pendingUpdate: TokenList | null;
            readonly loadingRequestId: string | null;
            readonly error: string | null;
        };
    };
    // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
    readonly lastInitializedDefaultListOfLists?: string[];

    // currently active lists
    readonly activeListUrls: string[] | undefined;
}

type ListState = ListsState['byUrl'][string];

const NEW_LIST_STATE: ListState = {
    error: null,
    current: null,
    loadingRequestId: null,
    pendingUpdate: null,
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] };

const initialState: ListsState = {
    lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
    byUrl: {
        ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
            memo[listUrl] = NEW_LIST_STATE;
            return memo;
        }, {}),
    },
    activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
};

export default createSlice({
    name: 'lists',
    initialState,
    reducers: {},
    // "builder callback API", recommended for TypeScript users
    extraReducers: (builder) => {
        // builder.addCase(incrementBy, (state, action) => {
        //     return state + action.payload;
        // });
        // builder.addCase(decrementBy, (state, action) => {
        //     return state - action.payload;
        // });

        builder
            .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
                const current = state.byUrl[url]?.current ?? null;
                const pendingUpdate = state.byUrl[url]?.pendingUpdate ?? null;

                state.byUrl[url] = {
                    current,
                    pendingUpdate,
                    loadingRequestId: requestId,
                    error: null,
                };
            })
            .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
                const current = state.byUrl[url]?.current;
                const loadingRequestId = state.byUrl[url]?.loadingRequestId;

                // console.log(current, url, tokenList);

                // no-op if update does nothing
                if (current) {
                    const upgradeType = getVersionUpgrade(current.version, tokenList.version);

                    if (upgradeType === VersionUpgrade.NONE) return;
                    if (loadingRequestId === null || loadingRequestId === requestId) {
                        state.byUrl[url] = {
                            current,
                            pendingUpdate: tokenList,
                            loadingRequestId: null,
                            error: null,
                        };
                    }
                } else {
                    // activate if on default active
                    if (DEFAULT_ACTIVE_LIST_URLS.includes(url)) {
                        state.activeListUrls?.push(url);
                    }

                    state.byUrl[url] = {
                        current: tokenList,
                        pendingUpdate: null,
                        loadingRequestId: null,
                        error: null,
                    };
                }
            })
            .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
                if (state.byUrl[url]?.loadingRequestId !== requestId) {
                    // no-op since it's not the latest request
                    return;
                }

                state.byUrl[url] = {
                    current: state.byUrl[url].current ? state.byUrl[url].current : null,
                    pendingUpdate: null,
                    loadingRequestId: null,
                    error: errorMessage,
                };
            });
    },
});
