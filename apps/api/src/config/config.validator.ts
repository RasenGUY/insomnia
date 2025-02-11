import * as Joi from 'joi'

export const configValidator = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development')
    .required(),
  SERVER_PORT: Joi.number().default(3000).required(),
  DATABASE_URL: Joi.string().required(),
  CACHE_TTL: Joi.number().default(600),
  LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error', 'fatal').default('info'),
})
