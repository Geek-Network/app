import { createClient, defaultChains, configureChains, createStorage } from 'wagmi';

// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public';

// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { infuraProvider } from 'wagmi/providers/infura'

// const alchemyId = process.env.ALCHEMY_ID

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
    // alchemyProvider({ alchemyId }),

    publicProvider(),
    infuraProvider({ infuraId:'07abb699df3e42bbafe45d8bfe4112be' }),
]);

// Set up client
const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        // new CoinbaseWalletConnector({
        //     chains,
        //     options: {
        //         appName: 'wagmi',
        //     },
        // }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    provider,
    storage: createStorage({ storage: window.localStorage }),
    webSocketProvider,
});

export default client;
