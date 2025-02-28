
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { TokenAssetMapper } from '@/utils/tokenAsset';
import { WalletLabel } from '@/lib/constants/supported-chains';
import { NFTAssetMapper } from '@/utils/nftAsset';


export const assetRouter = router({
  getTokenAssets: publicProcedure.input(
      z.object({
        address: z.string(),
        walletlabel: z.nativeEnum(WalletLabel),
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

  getNFTAssets: publicProcedure.input(
    z.object({
      address: z.string(),
      walletlabel: z.nativeEnum(WalletLabel),
      pageSize: z.number().optional(),
      pageKey: z.string().optional(),
    })
  ).query(async ({ input }) => { 
    try {
      const assets = await NFTAssetMapper.map(
        input.address, 
        input.walletlabel, 
        input.pageSize, 
        input.pageKey
      );
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
