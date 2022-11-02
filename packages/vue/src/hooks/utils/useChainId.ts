import { MaybeRef } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { computed } from 'vue-demi'

import { useProvider } from '../providers'

export type UseChainIdArgs = {
  chainId?: MaybeRef<number | undefined>
}

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  const computedChainId = computed(() => {
    const p = cloneDeep(provider.value)
    console.log(p)
    // return p._network.chainId
    return chainId
  })
  return computedChainId.value
}
