import {
  Connector,
  GetAccountResult,
  getAccount,
  watchAccount,
} from '@vue-ethereum-hooks/core'

import { MaybeRef, tryOnScopeDispose } from '@vueuse/core'
import { ref, unref, watch } from 'vue-demi'

export type AccountConfig = {
  /** Function to invoke when connected */
  onConnect?({
    address,
    connector,
    isReconnected,
  }: {
    address?: GetAccountResult['address']
    connector?: GetAccountResult['connector']
    isReconnected: boolean
  }): void
  /** Function to invoke when disconnected */
  onDisconnect?(): void
}

export type UseAccountConfig = {
  [Property in keyof AccountConfig]: MaybeRef<AccountConfig[Property]>
}

export function useAccount({ onConnect, onDisconnect }: UseAccountConfig = {}) {
  const previousAccount: Partial<GetAccountResult> & {
    current: GetAccountResult
  } = { current: getAccount() }
  const account = ref<GetAccountResult>(getAccount())
  const unsubscribeAccount = watchAccount((acc: GetAccountResult) => {
    account.value = acc
  })
  watch(
    account,
    () => {
      const plainConnect = unref(onConnect)
      const plainDisconnect = unref(onDisconnect)
      if (
        !!plainConnect &&
        previousAccount.current?.status !== 'connected' &&
        account.value.status === 'connected'
      )
        plainConnect({
          address: account.value.address,
          connector: account.value.connector as Connector,
          isReconnected: previousAccount.current?.status === 'reconnecting',
        })

      if (
        !!plainDisconnect &&
        previousAccount.current?.status == 'connected' &&
        account.value.status === 'disconnected'
      )
        plainDisconnect()
      previousAccount.current = account.value as GetAccountResult
    },
    {
      deep: true,
    },
  )
  tryOnScopeDispose(() => {
    unsubscribeAccount()
  })
  return {
    account,
  }
}
