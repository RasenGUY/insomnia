import { Config, Environment, LogLevel } from './config.interface'
import * as pack from '../../package.json'

const convertToName = (inputString: string): string => {
  return inputString
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const name = convertToName(pack.name)

export default (): Config => ({
  env: (process.env.NODE_ENV as Environment) || Environment.PRODUCTION,
  name,
  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000,
  version: pack.version,
  cors: {
    enabled: true,  
  },
  session: {
    secret: process.env.SESSION_SECRET ?? 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Should be true in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'lax' // Recommended for CSRF protection
    }
  },
  swagger: {
    enabled: true,
    title: `${name} Swagger`,
    description: `${name} Swagger definitions`,
    version: pack.version,
    path: '/',
  },
  cache: {
    ttl: +(process.env.CACHE_TTL ?? 3600),
  },
  log: {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    enableFile: process.env.WORKER_ENABLED === 'true',
    filePath: process.env.LOG_FILE_PATH ?? 'logs/',
  },
})
