import { SessionResponseData, Session  } from "types/session";

export function parseSessionSessionResponseData(sessionData: SessionResponseData): Session {
    return ({
        address: sessionData.address,
        chainId: sessionData.chainId,
        domain: sessionData.domain,
        issuedAt: new Date(sessionData.issuedAt),
    }) as Session;
}
