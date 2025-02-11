import { configServerSchema } from './configSchema'
import { getRequiredEnvVar } from 'utils/config'
import { ConfigServer, Environment } from 'types/config'

export const configServer: ConfigServer = {
  env: process.env.NODE_ENV as Environment,
  auth: {
    sessionMaxAge: parseInt(getRequiredEnvVar('AUTH_SESSION_MAX_AGE', 3600)),
  },
}

export const getServerConfiguration = async (): Promise<ConfigServer> => {
  return configServer
}

// Schema validation
getServerConfiguration().then((config) => {
  const validationResult = configServerSchema.validate(config)

  if (validationResult.error) {
    throw new Error(`Invalid config: ${validationResult.error.message}`)
  }
})

export default getServerConfiguration
