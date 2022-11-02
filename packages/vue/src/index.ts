export { createClient, useClient } from './client'
export type { CreateClientConfig } from './client'

export { deserialize, serialize } from './utils'

import type {} from 'eventemitter3'

export { useAccount } from './hooks'

export {
  AddChainError,
  ChainDoesNotSupportMulticallError,
  ChainMismatchError,
  ChainNotConfiguredError,
  Client,
  Connector,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
  ContractMethodDoesNotExistError,
  ContractMethodNoResultError,
  ContractMethodRevertedError,
  ContractResultDecodeError,
  ProviderChainsNotFound,
  ProviderRpcError,
  ResourceUnavailableError,
  RpcError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
  alchemyRpcUrls,
  allChains,
  chain,
  chainId,
  configureChains,
  createStorage,
  deepEqual,
  defaultChains,
  defaultL2Chains,
  erc20ABI,
  erc721ABI,
  etherscanBlockExplorers,
  infuraRpcUrls,
  publicRpcUrls,
  readContracts,
} from '@vue-ethereum-hooks/core'

export type {
  Chain,
  ChainProviderFn,
  ConnectorData,
  ConnectorEvents,
  Storage,
  Unit,
} from '@vue-ethereum-hooks/core'

export type { Address } from 'abitype'

export { wagmiVue } from './plugin'
