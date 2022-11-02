import {
  GetProviderArgs,
  Provider,
  getProvider,
  watchProvider,
} from '@vue-ethereum-hooks/core'
import { tryOnScopeDispose } from '@vueuse/core'
import { ref, unref, watchEffect } from 'vue-demi'

import { MaybeRef } from '../../types'

export type UseProviderArgs = Partial<{
  [Property in keyof GetProviderArgs]: MaybeRef<GetProviderArgs[Property]>
}>

export function useProvider<TProvider extends Provider>({
  chainId,
}: UseProviderArgs = {}) {
  const provider = ref<TProvider>(
    getProvider({ chainId: unref<number | undefined>(chainId) }),
  )
  let unsubscribe: () => void | undefined
  watchEffect((cleanupFn) => {
    unsubscribe = watchProvider(
      { chainId: unref<number | undefined>(chainId) },
      (p: Provider) => {
        provider.value = p
      },
    )

    cleanupFn(() => {
      unsubscribe()
    })
  })
  tryOnScopeDispose(() => {
    unsubscribe && unsubscribe()
  })
  return provider
}
