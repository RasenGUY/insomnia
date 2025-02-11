import Joi from 'joi'

export const configClientSchema = Joi.object({
  env: Joi.string().valid('production', 'development', 'test').required(),
  name: Joi.string().required(),
  version: Joi.string().required(),
  themes: Joi.array().required(),
  api: Joi.object({
    rest: Joi.object({
      url: Joi.string().required(),
    }).required(),
  }).required(),
  ethereum: Joi.object({
    chain: Joi.object().required(),
    providerUrl: Joi.string().required(),
    walletConnectId: Joi.string().required(),
  }).required(),
})

export const configServerSchema = Joi.object({
  env: Joi.string().valid('production', 'development', 'test').required(),
  api: Joi.object({
    rest: Joi.object({
        url: Joi.string().required(),
      }).required(),
  }).required(),
  auth: Joi.object({
    sessionMaxAge: Joi.number().required(),
  }).required(),
})
