import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducers
import { ModeReducer } from './dark';
import { ModalReducer } from './modal';
import { SwapReducer } from './swap';

const reducers = combineReducers({
    mode: ModeReducer,
    modal: ModalReducer,
    swap: SwapReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    timeout: 2000,
    whitelist: ['mode'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            immutableCheck: true,
            serializableCheck: false,
            // serializableCheck: {
            //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            // },
        }),
    devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// export type RootState = ReturnType<typeof persistReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
