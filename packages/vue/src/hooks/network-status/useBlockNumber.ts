import { useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  FetchBlockNumberArgs,
  FetchBlockNumberResult,
  fetchBlockNumber,
} from '@vue-ethereum-hooks/core'
import { debounce } from '@vue-ethereum-hooks/core/internal'

import { MaybeRef } from '@vueuse/core'
import { reactive, unref, watchEffect } from 'vue-demi'

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
  watch = false,
  onBlock,
  onError,
  onSettled,
  onSuccess,
}: UseBlockNumberArgs & UseBlockNumberConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const provider = useProvider({ chainId })
  const webSocketProvider = useWebSocketProvider({ chainId })
  const queryClient = useQueryClient()

  const queryKey = reactive([{ entity: 'blockNumber', chainId }])

  const queryFn = ({ queryKey: [k] }: { queryKey: typeof queryKey }) => {
    return fetchBlockNumber({ chainId: k?.chainId })
  }

  watchEffect((cleanupFn) => {
    if (!watch && !onBlock) return

    // We need to debounce the listener as we want to opt-out
    // of the behavior where ethers emits a "block" event for
    // every block that was missed in between the `pollingInterval`.
    // We are setting a wait time of 1 as emitting an event in
    // ethers takes ~0.1ms.
    const listener = debounce((blockNumber: number) => {
      // Just to be safe in case the provider implementation
      // calls the event callback after .off() has been called
      if (unref(watch)) queryClient.setQueryData(queryKey, blockNumber)
      if (onBlock) unref(onBlock)(blockNumber)
    }, 1)

    const provider_ = webSocketProvider ?? provider
    provider_.value?.on('block', listener)

    cleanupFn(() => {
      provider_.value?.off('block', listener)
    })
  })

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
