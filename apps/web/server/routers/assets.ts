
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { TokenAssetMapper } from '@/utils/tokenAsset';
import { WalletLabel } from '@/lib/constants/supported-chains';
import { NFTAssetMapper } from '@/utils/nftAsset';
import { AssetType } from '@/types/assets';
import { WagmiNFTClient } from '@/lib/wagmi/nftClient';
import { Config } from 'wagmi';  
import { WagmiTokenClient } from '@/lib/wagmi/tokenClient'; 
import { Address } from 'viem';
import { web3Config } from '@/components/providers/Web3Provider';

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
  
  transferNFTAsset: publicProcedure.input(
    z.object({
      web3Config: z.any(),
      address: z.string(),
      type: z.nativeEnum(AssetType),
      walletlabel: z.nativeEnum(WalletLabel),
      from: z.string(),
      tokenId: z.bigint(),
      to: z.string(),
      amount: z.bigint(),
    })
  ).mutation(async ({ input }) => { 
    try {
      const result = await WagmiNFTClient.transfer(
        web3Config as Config,
        {
          ...input,
          address: input.address as Address,
          from: input.from as Address,
          to: input.to as Address,
        }
      )
      return result;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to transfer NFT',
        cause: error,
      });
    }
  }),

  transferTokenAsset: publicProcedure.input(
    z.object({
      web3Config: z.any(),
      address: z.string(),
      type: z.nativeEnum(AssetType),
      walletlabel: z.nativeEnum(WalletLabel),
      from: z.string(),
      to: z.string(),
      amount: z.bigint().gt(0n),
    })
  ).mutation(async ({ input }) => { 
    try {
      const result = await WagmiTokenClient.transfer(
        web3Config as Config,
        {
          ...input,
          address: input.address as Address,
          to: input.to as Address,
        }
      )
      return result;
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
        cause: error,
      });
    }
  }),
  
}); 
