// server/routers/session.ts
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
    .mutation(async ({ input, ctx }) => {
      try {
        let isValid: boolean = false;
        if(ctx.session) isValid = validateSession(ctx.session, input);
        return { isValid };
      } catch (error) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Failed to validate session',
            cause: error,
          }
        );
      }
    }),
});