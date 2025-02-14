import { SessionState } from "@/types/session";

export function validateSession(
    sessionData: SessionState,
    walletData: {
      address: string,
      chainId: number,
    }
  ){

  if (
      !sessionData.address || 
      !sessionData.chainId ||
      !sessionData.domain || 
      !sessionData.expirationTime
    ) {
      return false;
  }

  if (    
    sessionData.address.toLocaleLowerCase() !== walletData.address.toLocaleLowerCase() || 
    sessionData.chainId !== walletData.chainId
  ) {
      return false;
  }

  if(
      sessionData.domain !== window.location.origin    
  ){
    return false;
  }
  if(
      sessionData.expirationTime >= new Date()    
  ){
    return false;
  }
  return true;
}