// server/routers/auth.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configServer';
import { RegistrationResponse } from '@/types/auth';


export const authRouter = router({
  getNonce: publicProcedure
    .query(async ({ ctx }) => { 
      const response = await fetch(`${config.api.rest.url}/auth/nonce`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get nonce',
        });
      }
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        ctx.setCookieHeader = setCookie;
      }

      const { data: { nonce } } = await response.json();
      return { nonce };
    }),

    verify: publicProcedure
    .input(z.object({
      message: z.string(),
      signature: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log({
        message: input.message,
        signature: input.signature,
        ctx: ctx
      })
      const response = await fetch(`${config.api.rest.url}/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': ctx.setCookieHeader as string,
        },
        body: JSON.stringify({ 
          message: input.message, 
          signature: input.signature
        }),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Verification failed',
        });
      }

      return response.json();
    }),

  logout: publicProcedure
    .mutation(async () => {
      const response = await fetch(`${config.api.rest.url}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Logout failed',
        });
      }

      return { success: true };
    }),

    register: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        address: z.string(),
      }))
      .mutation(async ({ input }) => {

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(input)
          })
          const { data } = await response.json()
          return { 
            ...data
          } as RegistrationResponse;
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to register',
            cause: error,
          });
        }
      }),
});

