import { cache } from 'react';
import { type Session } from '@/types/session';
import { config } from '@/config/configServer';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

const API_URL = config.api.rest.url;

export const createContext = cache(async (opts: any) =>{
  console.log({
    contextOptions:opts
  })
  const res = await fetch(`${API_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include',
  });
  let session: Session | null = null;
  const setCookieHeader: string | null = '';
  if (res.ok) {
    const { data: sessionData } = await res.json();
    session = sessionData;
  };
  return { session, setCookieHeader };
}) 


export type Context = Awaited<ReturnType<typeof createContext>>;
