import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configServer';
import { ApiSuccessResponseBase } from '@/types/api';
import { Profile } from '@/types/profle';

export const resolverRouter = router({
  resolve: publicProcedure
    .input(z.object({
      username: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result: Response = await fetch(`${config.api.rest.url}/resolve/${input.username}`)
        const { data }: ApiSuccessResponseBase<Profile> = await result.json();
        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to validate session',
          cause: error,
        });
      }
    }),

  reverse: publicProcedure
    .input(z.object({
      address: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result: Response = await fetch(`${config.api.rest.url}/resolve/reverse/${input.address}`)
        const { data }: ApiSuccessResponseBase<Profile> = await result.json();
        console.log({
          message: 'Reverse resolved profile',
          data,
          input,
        })
        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to validate session',
          cause: error,
        });
      }
    }),
});