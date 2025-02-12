export interface VerifyResponse {
  success: boolean
  data: SessionResponseData
}

export interface SessionResponse {
  success: boolean; 
  data: SessionResponseData
}
export interface SessionResponseData {
  address: string;
  chainId: number;
  domain: string;
  issuedAt: string;
  expirationTime: string
}

export interface RegistrationDto {
  address: string;
  username: string;
}

export interface RegistrationResponse {
  success: boolean
  data: {
    id: string
    username: string
    address: string
    createdAt: string
  }
}

export interface NonceResponse {
  success: boolean; 
  data:  {nonce: string};
}