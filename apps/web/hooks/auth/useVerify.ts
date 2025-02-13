import { fetchNonce } from "@/api/queries/auth";
import { useMutation } from "@tanstack/react-query";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import { verifySiwe } from "api/queries/auth";

export const useVerify = () => {
    const { signMessageAsync } = useSignMessage()
    
    return useMutation({
      mutationFn: async ({ address, chainId }: { address: string; chainId: number }) => {
        // 1. Get nonce
        await fetchNonce()
  
        // 2. Create SIWE message
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with you wallet.',
          uri: window.location.origin,
          version: '1',
          chainId,
        })
  
        // 3. Sign message
        const signature = await signMessageAsync({
          message: message.prepareMessage()
        })
  
        // 4. Verify signature
        return verifySiwe({
          message: message.prepareMessage(),
          signature
        })
      }
    })
  }