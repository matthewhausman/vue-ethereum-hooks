import { MaybeRef } from '@vueuse/core'

import { useProvider } from '../providers'

export type UseChainIdArgs = {
  chainId?: MaybeRef<number>
}

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId })
  return provider.value.network.chainId
}
