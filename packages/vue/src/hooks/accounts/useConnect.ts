import { UseMutationOptions, useMutation } from '@tanstack/vue-query'
import {
  ConnectArgs,
  ConnectResult,
  Connector,
  connect,
} from '@vue-ethereum-hooks/core'
import { MaybeRef } from '@vueuse/core'
import { computed, isRef, unref } from 'vue-demi'

import { useClient } from '../../client'

export type UseConnectArgs = Partial<{
  [Property in keyof ConnectArgs]: MaybeRef<ConnectArgs[Property]>
}>

export type UseConnectConfig = UseMutationOptions<
  ConnectResult,
  Error,
  ConnectArgs,
  undefined
>

export const mutationKey = (args: Partial<ConnectArgs>) =>
  [{ entity: 'connect', ...args }] as const

const mutationFn = (args: ConnectArgs) => {
  const { connector, chainId } = args
  if (!connector) throw new Error('connector is required')
  return connect({
    connector: connector,
    chainId: chainId,
  })
}

export function useConnect({
  chainId,
  connector,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseConnectArgs & UseConnectConfig = {}) {
  const client = useClient()
  const computedMutationKey = computed(() => {
    return mutationKey({
      connector: unref<Connector | undefined>(connector),
      chainId: unref<number | undefined>(chainId),
    })
  })

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(computedMutationKey, mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const connect = (args?: Partial<ConnectArgs>) => {
    const plainConnector = isRef(connector) ? connector.value : connector
    if (!plainConnector) return
    return mutate({
      chainId: args?.chainId ?? unref<number | undefined>(chainId),
      connector: args?.connector ?? plainConnector,
    })
  }

  const connectAsync = (args?: Partial<ConnectArgs>) => {
    const plainConnector = isRef(connector) ? connector.value : connector
    if (!plainConnector) return
    return mutateAsync({
      chainId: args?.chainId ?? unref<number | undefined>(chainId),
      connector: args?.connector ?? plainConnector,
    })
  }

  return {
    connect,
    connectAsync,
    connectors: computed(() => client.value.connectors),
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingConnector: computed(() => variables.value?.connector),
    reset,
    status,
    variables,
  } as const
}
