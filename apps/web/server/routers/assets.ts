
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { TokenAssetMapper } from '@/utils/tokenAsset';

export const assetRouter = router({
  getTokenAssets: publicProcedure.input(
      z.object({
        address: z.string(),
        walletlabel: z.number()
      })
    ).query(async ({ input }) => { 
      try {
        const assets = await TokenAssetMapper.map(input.address, input.walletlabel);
        return assets;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch token assets',
          cause: error,
        });
      }
    }),
});
