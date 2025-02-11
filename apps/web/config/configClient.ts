import { Chain, polygon, localhost, polygonMumbai } from 'viem/chains'

import { configClientSchema } from 'config/configSchema'
import { getRequiredEnvVar } from 'utils/config'
import { Config, Environment, Theme } from 'types/config'

const name = 'Autominter'

const getChain = (chainName: string): Chain => {
  switch (chainName) {
    case 'polygon':
      return polygon
    case 'polygonMumbai':
      return polygonMumbai
    case 'localhost':
      return localhost
    default:
      throw new Error(`Chain ${chainName} not supported`)
  }
}

export const config: Config = {
  env: process.env.ENV
    ? (process.env.ENV as Environment)
    : Environment.PRODUCTION,
  name,
  version: process.env.version ? process.env.version : '0.0.0',
  themes: [Theme.DARK, Theme.LIGHT],
  api: {
    rest: {
      url: getRequiredEnvVar('NEXT_PUBLIC_API', '#'),
    },
  },
  ethereum: {
    chain: getChain(
      getRequiredEnvVar('NEXT_PUBLIC_ETHEREUM_CHAIN', 'localhost'),
    ),
    providerUrl: getRequiredEnvVar('NEXT_PUBLIC_ETHEREUM_PROVIDER_URL', '#'),
    walletConnectId: getRequiredEnvVar('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID', '#'),
  },
}

export const getClientConfiguration = async (): Promise<Config> => {
  return config
}

// Schema validation
getClientConfiguration().then((config) => {
  const validationResult = configClientSchema.validate(config)

  if (validationResult.error) {
    throw new Error(`Invalid config: ${validationResult.error.message}`)
  }
})

export default getClientConfiguration
