import { useQuery } from '@tanstack/vue-query'
import {
  FetchFeeDataArgs,
  FetchFeeDataResult,
  fetchFeeData,
} from '@vue-ethereum-hooks/core'

import { MaybeRef } from '@vueuse/core'
import { reactive, unref, watch as watch_ } from 'vue-demi'

import { QueryConfig } from '../../types'
import { useBlockNumber } from '../network-status'
import { useChainId } from '../utils'

export type ReactiveFetchFeeDataArgs = {
  [Property in keyof FetchFeeDataArgs]: MaybeRef<FetchFeeDataArgs[Property]>
}

type UseFeeDataArgs = Partial<ReactiveFetchFeeDataArgs> & {
  /** Subscribe to changes */
  watch?: MaybeRef<boolean>
}

export type UseFeedDataConfig = QueryConfig<FetchFeeDataResult, Error>

export function useFeeData({
  cacheTime,
  chainId: chainId_,
  enabled = true,
  formatUnits = 'wei',
  staleTime,
  suspense,
  watch,
  onError,
  onSettled,
  onSuccess,
}: UseFeeDataArgs & UseFeedDataConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  const queryKey = reactive([{ entity: 'feeData', chainId, formatUnits }])

  const queryFn = ({ queryKey: [k] }: { queryKey: typeof queryKey }) => {
    return fetchFeeData({ chainId: k?.chainId, formatUnits: k?.formatUnits })
  }

  const feeDataQuery = useQuery(queryKey, queryFn, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const { data: blockNumber } = useBlockNumber({ chainId, watch })

  watch_(
    [blockNumber],
    () => {
      if (!unref(enabled)) return
      if (!unref(watch)) return
      if (!unref(blockNumber)) return
      feeDataQuery.refetch()
    },
    {
      deep: true,
    },
  )

  return feeDataQuery
}
