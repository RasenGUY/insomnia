
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { config } from '@/config/configClient';
import { GetNonceResponse, RegistrationResponse, VerifyResponse } from '@/types/auth';
import { registrationSchema } from '@/lib/validations/auth';
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

// const url = 'https://eth-mainnet.g.alchemy.com/v2/Mgy9nDoMx8hAMw5qfnUlALOIYlYXCxQT';
// const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
// };

// const body = JSON.stringify({
//     id: 1,
//     jsonrpc: "2.0",
//     method: "alchemy_getTokenBalances",
//     params: [
//         "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
//         "erc20"
//     ]
// });

// fetch(url, {
//     method: 'POST',
//     headers: headers,
//     body: body
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));
