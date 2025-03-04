import { configServerSchema } from './configSchema'
import { getRequiredEnvVar } from 'utils/config'
import { ConfigServer, Environment } from 'types/config'

export const config: ConfigServer = {
  env: process.env.NODE_ENV as Environment,
  port: parseInt(getRequiredEnvVar('PORT', 3000)),
  auth: {
    sessionMaxAge: parseInt(getRequiredEnvVar('AUTH_SESSION_MAX_AGE', 3600)),
  },
  vercel: {
    url: getRequiredEnvVar('VERCEL_URL'),
  },
  render: {
    hostname: getRequiredEnvVar('RENDER_INTERNAL_HOSTNAME'),
  },
  api: {
    token: {
      url:[
        'https://',
        getRequiredEnvVar('NEXT_PUBLIC_DEFAULT_API_NETWORK'),
        '.g.alchemy.com/v2/',
        getRequiredEnvVar('NEXT_PUBLIC_ALCHEMY_PRIVATE_KEY'),
      ].join(''),
    },
    price: {
      url: 
        [
          'https://api.g.alchemy.com/prices/v1/',
          getRequiredEnvVar('NEXT_PUBLIC_ALCHEMY_PRIVATE_KEY'),
      ].join(''),
    },
    nft: {
      url: [
        'https://',
        getRequiredEnvVar('NEXT_PUBLIC_DEFAULT_API_NETWORK'),
        '.g.alchemy.com/nft/v3/',
        getRequiredEnvVar('NEXT_PUBLIC_ALCHEMY_PRIVATE_KEY'),
      ].join(''),
    },
    rest: {
      url: getRequiredEnvVar('NEXT_PUBLIC_API'),
    },
  },
}
export const getServerConfiguration = async (): Promise<ConfigServer> => {
  return config
}

getServerConfiguration().then((config) => {
  const validationResult = configServerSchema.safeParse(config)
  if (!validationResult.success) {
    // safeParse returns a detailed error if the config does not match the schema
    throw new Error(`Invalid config: ${validationResult.error.message}`)
  }
})

export default getServerConfiguration
