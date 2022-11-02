import {
  GetProviderArgs,
  Provider,
  getProvider,
  watchProvider,
} from '@vue-ethereum-hooks/core'
import { MaybeRef } from '@vueuse/core'
import { ref, unref, watchEffect } from 'vue-demi'

export type ReactiveGetProviderArgs = {
  [Property in keyof GetProviderArgs]: MaybeRef<GetProviderArgs[Property]>
}

export type UseProviderArgs = Partial<ReactiveGetProviderArgs>

export function useProvider<TProvider extends Provider>({
  chainId,
}: UseProviderArgs = {}) {
  const provider = ref<TProvider>(
    getProvider({ chainId: unref<number | undefined>(chainId) }),
  )

  watchEffect((cleanupFn) => {
    const unsubscribe = watchProvider(
      { chainId: unref<number | undefined>(chainId) },
      (p: Provider) => {
        provider.value = p
      },
    )

    cleanupFn(() => {
      unsubscribe()
    })
  })

  return provider
}
