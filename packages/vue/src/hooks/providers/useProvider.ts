import type { GetProviderArgs, Provider } from '@vue-ethereum-hooks/core'
import { getProvider, watchProvider } from '@vue-ethereum-hooks/core'
import { MaybeRef } from '@vueuse/core'
import { shallowRef, unref } from 'vue-demi'

export type ReactiveGetProviderArgs = {
  [Property in keyof GetProviderArgs]: MaybeRef<GetProviderArgs[Property]>
}

export type UseProviderArgs = Partial<ReactiveGetProviderArgs>

export function useProvider<TProvider extends Provider>({
  chainId,
}: UseProviderArgs = {}) {
  const provider = shallowRef<TProvider>(
    getProvider({
      chainId: unref<number | undefined>(chainId),
    }),
  )

  watchProvider<TProvider>({ chainId: unref(chainId) }, (v) => {
    provider.value = v
  })

  return provider
}
