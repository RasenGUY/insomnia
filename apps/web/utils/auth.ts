import { Session } from "@/types/session";

export function validateSession(
    sessionData: Session,
    walletData: {
      address: string,
      chainId: number,
    }
  ){

  if (
      !sessionData.address || 
      !sessionData.chainId ||
      !sessionData.domain 
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
    sessionData.issuedAt >= new Date()    
  ){
    return false;
  }
  return true;
}