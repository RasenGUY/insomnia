// server/routers/auth.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { SiweMessage } from 'siwe';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configServer';

export const authRouter = router({
  verifyWallet: publicProcedure
    .input(z.object({
      message: z.string(),
      signature: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // request nonce first
        await fetch(config.api.rest.url.concat('/auth/nonce'), {
          method: 'GET',
          credentials: 'include',
        })

        // assume success if async method is allowed to complete
        await fetch(config.api.rest.url.concat('/auth/verify'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(input)
        })

        return {
          verified: true,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error?.message || 'Invalid signature',
          cause: error,
        });
      }
    }),

  register: publicProcedure
    .input(z.object({
      username: z.string().min(3),
      address: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Your registration logic here
        return {
          success: true,
          username: input.username,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register',
          cause: error,
        });
      }
    }),
});