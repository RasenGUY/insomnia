import { Connector } from "wagmi";

export const getWalletConnectionData = async (connector: Connector) => {
  const connectedAccounts = await connector.getAccounts(); 
  const connectedAccount = connectedAccounts[0];
  const chainId = (await connector.getChainId());
  return { connectedAccount, chainId };
}