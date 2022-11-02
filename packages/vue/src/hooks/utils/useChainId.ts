import { MaybeRef } from '@vueuse/core'
import { computed } from 'vue-demi'

import { useProvider } from '../providers'

export type UseChainIdArgs = {
  chainId?: MaybeRef<number>
}

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  const computedChainId = computed(() => {
    return provider.value.network.chainId
  })
  return computedChainId
}
