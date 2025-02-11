import { Chain } from 'viem'

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Config {
  env: Environment
  name: string
  version: string
  themes: Theme[]
  api: ApiConfig
  ethereum: EthereumConfig
}

export interface ConfigServer {
  env: Environment
  auth: AuthServerConfig
}

export interface ApiConfig {
  rest: {
    url: string
  }
}

export interface AuthServerConfig {
  sessionMaxAge: number
}

export interface EthereumConfig {
  chain: Chain
  providerUrl: string
}

