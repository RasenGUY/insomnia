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
  port: number
  env: Environment
  auth: AuthServerConfig
  api: ApiConfig
  vercel: VercelConfig
  render: RenderConfig
}

export interface ApiConfig {
  rest: {
    url: string
  }
}
export interface VercelConfig {
  url: string
}
export interface RenderConfig {
  hostname: string
}

export interface AuthServerConfig {
  sessionMaxAge: number
}

export interface EthereumConfig {
  chain: Chain
  providerUrl: string
  walletConnectId: string
}

