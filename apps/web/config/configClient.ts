import { Chain, polygon, localhost, polygonMumbai } from 'viem/chains'
import { configClientSchema } from 'config/configSchema'
import { getRequiredEnvVar } from 'utils/config'
import { Config, Environment, Theme } from 'types/config'

const name = 'Insomnia Wallet'

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
  env: process.env.NODE_ENV
    ? (process.env.NODE_ENV as Environment)
    : Environment.PRODUCTION,
  name,
  version: process.env.version ? process.env.version : '0.0.0',
  themes: [Theme.DARK, Theme.LIGHT],
  api: {
    rest: {
      url: getRequiredEnvVar('NEXT_PUBLIC_API'),
    },
  },
  wallet: {
    defaultNetwork: getChain(
      getRequiredEnvVar('NEXT_PUBLIC_DEFAULT_WALLET_NETWORK', 'polygon'),
    ),
    walletConnectId: getRequiredEnvVar('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'),
    providerUrl: [
      'https://',
      getRequiredEnvVar('NEXT_PUBLIC_DEFAULT_API_NETWORK'),
      '.g.alchemy.com/v2/',
      getRequiredEnvVar('NEXT_PUBLIC_ALCHEMY_PRIVATE_KEY')
    ].join(''),
  },
}

export const getClientConfiguration = async (): Promise<Config> => {
  console.dir({
    message: 'configClient',
    config,
  }, { depth: null })
  return config
}

getClientConfiguration().then((config) => {
  const validationResult = configClientSchema.safeParse(config)
  if (!validationResult.success) {
    throw new Error(`Invalid config: ${validationResult.error.message}`)
  }
})

export default getClientConfiguration
