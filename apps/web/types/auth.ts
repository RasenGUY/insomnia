import { ApiSuccessResponseBase } from "@/lib/fetch/types";
import { Profile } from "./profle";
import { Session } from "./session";

export interface Nonce {
  nonce: string;
}

export interface GetNonceResponse extends ApiSuccessResponseBase<Nonce> {}

export interface VerifyResponse extends ApiSuccessResponseBase<Omit<Session, 'isValid'>> {}

export interface RegistrationResponse extends ApiSuccessResponseBase<Profile> {}

