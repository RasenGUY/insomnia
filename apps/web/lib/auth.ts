import { SiweMessage } from 'siwe'
  
export const createSiweMessage = (address: string, nonce: string) => {
  return new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in with Ethereum to the app.',
    uri: window.location.origin,
    version: '1',
    chainId: 1,
    nonce,
  })
}
