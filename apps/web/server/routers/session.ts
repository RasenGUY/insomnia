import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { validateSession } from '@/utils/auth';
import { TRPCError } from '@trpc/server';

export const sessionRouter = router({
  validateSession: publicProcedure
    .input(z.object({
      address: z.string(),
      chainId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        
        let isValid: boolean = false;
        if(ctx.session) {
          isValid = validateSession(ctx.session, input);
        }
        return { isValid };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to validate session',
          cause: error,
        });
      }
    }),
});