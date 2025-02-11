export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export interface Config {
  env: Environment
  name: string
  port: number
  version: string
  cors: CorsConfig
  swagger: SwaggerConfig
  session: SessionConfig
  cache: CacheConfig
  log: LogConfig
}

export interface CorsConfig {
  enabled: boolean
}

export interface SwaggerConfig {
  enabled: boolean
  title: string
  description: string
  version: string
  path: string
}

export interface CacheConfig {
  ttl: number
}

export interface SessionConfig {
  secret: string
  resave: boolean
  saveUninitialized: boolean
  cookie: {
    secure: boolean
  }
}

export interface LogConfig {
  level: LogLevel
  enableFile: boolean
  filePath: string
}
