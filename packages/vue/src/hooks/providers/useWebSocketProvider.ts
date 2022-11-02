import {
  GetWebSocketProviderArgs,
  GetWebSocketProviderResult,
  WebSocketProvider,
  getWebSocketProvider,
  watchWebSocketProvider,
} from '@vue-ethereum-hooks/core'
import { tryOnScopeDispose } from '@vueuse/core'
import { ref, unref, watchEffect } from 'vue-demi'

import { MaybeRef } from '../../types'

export type UseWebSocketProviderArgs = Partial<{
  [Property in keyof GetWebSocketProviderArgs]: MaybeRef<
    GetWebSocketProviderArgs[Property]
  >
}>

export function useWebSocketProvider<
  TWebSocketProvider extends WebSocketProvider,
>({ chainId }: UseWebSocketProviderArgs = {}) {
  const webSocketProvider = ref(
    getWebSocketProvider<TWebSocketProvider>({
      chainId: unref<number | undefined>(chainId),
    }) as GetWebSocketProviderResult,
  )

  let unsubscribe: () => void | undefined
  watchEffect((cleanupFn) => {
    unsubscribe = watchWebSocketProvider<TWebSocketProvider>(
      { chainId: unref<number | undefined>(chainId) },
      (w: GetWebSocketProviderResult) => {
        webSocketProvider.value = w
      },
    )
    cleanupFn(() => {
      unsubscribe()
    })
  })
  tryOnScopeDispose(() => {
    unsubscribe && unsubscribe()
  })

  return webSocketProvider
}
