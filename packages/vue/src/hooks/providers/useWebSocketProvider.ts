import {
  GetWebSocketProviderArgs,
  WebSocketProvider,
  getWebSocketProvider,
  watchWebSocketProvider,
} from '@vue-ethereum-hooks/core'
import { MaybeRef } from '@vueuse/core'
import { shallowRef, triggerRef, unref } from 'vue-demi'

export type ReactiveGetWebSocketProviderArgs = {
  [Property in keyof GetWebSocketProviderArgs]: MaybeRef<
    GetWebSocketProviderArgs[Property]
  >
}

export type UseWebSocketProviderArgs = Partial<ReactiveGetWebSocketProviderArgs>

export function useWebSocketProvider<
  TWebSocketProvider extends WebSocketProvider,
>({ chainId }: UseWebSocketProviderArgs = {}) {
  const webSocketProvider = shallowRef(
    getWebSocketProvider<TWebSocketProvider>({
      chainId: unref<number | undefined>(chainId),
    }),
  )
  watchWebSocketProvider<TWebSocketProvider>(
    { chainId: unref(chainId) },
    (v) => {
      webSocketProvider.value = v
      triggerRef(webSocketProvider)
    },
  )
  return webSocketProvider
}
