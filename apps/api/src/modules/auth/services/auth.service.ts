import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce, VerifyParams, SiweResponse, VerifyOpts } from 'siwe';

@Injectable()
export class AuthService {
    async generateNonce(): Promise<string> {
        return generateNonce();
    }

    /**
     * Verifies a SIWE message and signature
     * @param preparedMessage The prepared SIWE message string
     * @param signature The Ethereum signature
     * @param nonce The nonce to verify against
     * @returns Promise<SiweMessage> The verified message or throws an error
     */
    async verifySiweMessage(
        preparedMessage: string, 
        signature: string,
        nonce: string
    ): Promise<SiweMessage> {
        const SIWEObject = new SiweMessage(preparedMessage);
        const { data: message, success, error }: SiweResponse = await SIWEObject.verify({ 
            signature, 
            nonce 
        } as VerifyParams);

        if (!success || error) {
            throw error;
        }
        return message;
    }
}