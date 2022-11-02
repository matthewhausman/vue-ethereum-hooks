API is identical to wagmi. Check out wagmi.sh for examples

Initialization Example:

```
import { boot } from 'quasar/wrappers'
import { wagmiVue } from '@vue-ethereum-hooks/hooks'

import { publicProvider } from '@vue-ethereum-hooks/hooks/providers/public'

import { CoinbaseWalletConnector } from '@vue-ethereum-hooks/hooks/connectors/coinbaseWallet'
import { InjectedConnector } from '@vue-ethereum-hooks/hooks/connectors/injected'
import { MetaMaskConnector } from '@vue-ethereum-hooks/hooks/connectors/metaMask'
import { WalletConnectConnector } from '@vue-ethereum-hooks/hooks/connectors/walletConnect'

import { configureChains, defaultChains } from '@vue-ethereum-hooks/hooks'

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
])

export default boot(({ app }) => {
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
})
```
