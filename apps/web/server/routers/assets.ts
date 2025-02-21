
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configClient';
import { AssetType } from '@/types/assets';

const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const authRouter = router({
  getTokenAssets: publicProcedure.input(
      z.object({
        address: z.string(),
      })
    ).query(async ({ input }) => { 
      const responseTokens = await fetch(`${config.ethereum.providerUrl}`, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [
            input.address,
            AssetType.ERC20
          ]
        })
      });
      if (!responseTokens.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get erc20 assets',
        });
      }

      const responseMetadata = await fetch(`${config.ethereum.providerUrl}`, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenMetadata",
          params: [
            input.address,
          ]
        })
      });
      
      if (!responseMetadata.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get erc20 assets metadata',
        });
      }
      
      return [];
    }),


});
