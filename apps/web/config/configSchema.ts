import { z } from 'zod';

export const configClientSchema = z.object({
  env: z.enum(['production', 'development', 'test']),
  name: z.string(),
  version: z.string(),
  themes: z.array(z.any()), // Adjust inner type if needed
  api: z.object({
    rest: z.object({
      url: z.string(),
    }),
  }),
  ethereum: z.object({
    // Accepts any object shape. Use .passthrough() to allow extra keys.
    chain: z.object({}).passthrough(),
    providerUrl: z.string(),
    walletConnectId: z.string(),
  }),
});

export const configServerSchema = z.object({
  env: z.enum(['production', 'development', 'test']),
  api: z.object({
    rest: z.object({
      url: z.string(),
    }),
  }),
  auth: z.object({
    sessionMaxAge: z.number(),
  }),
  // Optional sections since they weren't marked as required
  vercel: z.object({
    url: z.string(),
  }).optional(),
  render: z.object({
    hostname: z.string(),
  }).optional(),
});
