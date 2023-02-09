import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import { configureChains , defaultChains, wagmiVue } from '@vue-ethereum-hooks/hooks'


import { CoinbaseWalletConnector } from '@vue-ethereum-hooks/hooks/connectors/coinbaseWallet'
import { InjectedConnector } from '@vue-ethereum-hooks/hooks/connectors/injected'
import { MetaMaskConnector } from '@vue-ethereum-hooks/hooks/connectors/metaMask'
import { WalletConnectConnector } from '@vue-ethereum-hooks/hooks/connectors/walletConnect'
import { publicProvider } from '@vue-ethereum-hooks/hooks/providers/public'
import { alchemyProvider } from '@vue-ethereum-hooks/hooks/providers/alchemy'


const app = createApp(App)

app.use(router)


const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider(),
])

wagmiVue.install(app, {
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'moonlight.xyz',
      },
    }),
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
})

app.mount('#app')
