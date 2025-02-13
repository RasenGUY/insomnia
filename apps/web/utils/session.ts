import { GetSessionResponseData, SessionState } from "types/session";

export function parseSessionState(
    data: GetSessionResponseData | undefined
) {
    if (!data) {
        return null;
    }
    return ({
        address: data.address,
        chainId: data.chainId,
        domain: data.domain,
        issuedAt: new Date(data.issuedAt),
        expirationTime: new Date(data.expirationTime),
    }) as SessionState;
}
