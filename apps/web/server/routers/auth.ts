import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configServer';
import { GetNonceResponse, RegistrationResponse, VerifyResponse } from '@/types/auth';
import { registrationSchema } from '@/lib/validations/auth';

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

      const responseCookie = response.headers.get('set-cookie')!;
      if(responseCookie) {
        ctx.setSerialidedCookie(responseCookie);
      }

      const { data }: GetNonceResponse = await response.json();
      return data;
    }),

  verify: publicProcedure
  .input(z.object({
    message: z.string(),
    signature: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {

    const cookies = ctx.req.headers.get('cookie');
    const response = await fetch(`${config.api.rest.url}/auth/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(cookies && { cookie: cookies }),
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
    
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      ctx.setSerialidedCookie(setCookieHeader);
      console.log({
        message: 'setSerialidedCookie verify',
        setCookieHeader
      })
    }
    
    const { data }: VerifyResponse = await response.json();
    return data;
  }),

  register: publicProcedure
    .input(registrationSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`${config.api.rest.url}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(input)
        })
        const { data }: RegistrationResponse = await response.json()
        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register',
          cause: error,
        });
      }
    }),
});

