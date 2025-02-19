import { cache } from 'react';
import { SessionResponse, type Session } from '@/types/session';
import { config } from '@/config/configServer';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { parseSessionSessionResponseData } from '@/utils/session';

const API_URL = config.api.rest.url;
export const createContext = cache(async ({ req, resHeaders }: FetchCreateContextFnOptions) =>{
  const cookiesFromReq = req.headers.get('cookie');
  const res = await fetch(`${API_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(cookiesFromReq && { cookie: cookiesFromReq }),
    },
  });
  let session: Session | null = null;
  if (res.ok) {
    const { data: sessionResponseData }: SessionResponse = await res.json();
    session = parseSessionSessionResponseData(sessionResponseData);
  };

  return { 
    req,
    resHeaders, 
    session,
    setSerialidedCookie(cookieString: string) {
      resHeaders.set(
        'set-cookie',
        cookieString,
      )
    }
  };
}) 

export type Context = Awaited<ReturnType<typeof createContext>>;
