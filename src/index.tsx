/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';

import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { WagmiConfig } from 'wagmi';

import client from './helper/web3';

// import reportWebVitals from './reportWebVitals';

import { persistor, store } from './store';
import { Suspense } from 'react';

import App from './app';

// const container = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);

root.render(
    <WagmiConfig client={client}>
        <Provider store={store}>
            <Suspense>
                <PersistGate loading={null} persistor={persistor}>
                    <App />                    
                </PersistGate>
            </Suspense>
        </Provider>
    </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
