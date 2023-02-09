import { useQuery } from '@tanstack/vue-query'
import {
  FetchBlockNumberArgs,
  FetchBlockNumberResult,
  fetchBlockNumber,
} from '@vue-ethereum-hooks/core'
// import { debounce } from '@vue-ethereum-hooks/core/internal'

import { MaybeRef } from '@vueuse/core'
import { reactive } from 'vue-demi'

import { QueryConfig } from '../../types'
import { useProvider, useWebSocketProvider } from '../providers'
import { useChainId } from '../utils'

export type ReactiveFetchFeeDataArgs = {
  [Property in keyof FetchBlockNumberArgs]: MaybeRef<
    FetchBlockNumberArgs[Property]
  >
}

type UseBlockNumberArgs = Partial<ReactiveFetchFeeDataArgs> & {
  /** Function fires when a new block is created */
  onBlock?: MaybeRef<(blockNumber: number) => void>
  /** Subscribe to changes */
  watch?: MaybeRef<boolean>
}

export type UseBlockNumberConfig = QueryConfig<FetchBlockNumberResult, Error>

export function useBlockNumber({
  cacheTime = 0,
  chainId: chainId_,
  enabled = true,
  staleTime,
  suspense,
  // watch = false,
  // onBlock,
  onError,
  onSettled,
  onSuccess,
}: UseBlockNumberArgs & UseBlockNumberConfig = {}) {
  console.log(chainId_)
  const chainId = useChainId({ chainId: chainId_ })
  console.log(chainId)
  const provider = useProvider({ chainId })
  const webSocketProvider = useWebSocketProvider({ chainId })
  // console.log(provider.value.on())
  // const queryClient = useQueryClient()

  const queryKey = reactive([{ entity: 'blockNumber', chainId }])

  const queryFn = ({ queryKey: [k] }: { queryKey: typeof queryKey }) => {
    const d = fetchBlockNumber({ chainId: k?.chainId })
    return d
  }

  const provider_ = webSocketProvider.value ?? provider.value
  provider_?.on('block', (blockNumber: number) => {
    console.log(blockNumber)
    console.log('blocked up')
  })
  console.log(provider_.listeners('block'))

  return useQuery(queryKey, queryFn, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
