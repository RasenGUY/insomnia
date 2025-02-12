import { SessionResponseData, SessionState } from "types/session";

export function parseSessionState(
    data: SessionResponseData 
) {
    return ({
        address: data.address,
        chainId: data.chainId,
        domain: data.domain,
        issuedAt: new Date(data.issuedAt),
        expirationTime: new Date(data.expirationTime),
    }) as SessionState;
}
