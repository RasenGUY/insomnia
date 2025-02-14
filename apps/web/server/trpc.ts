// server/trpc.ts
import { initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from '@/types/session';
import { config } from '@/config/configServer';


const API_URL = config.api.rest.url;
export async function createContext(opts: CreateNextContextOptions) {
  const cookie = opts.req.headers.cookie;
  const res = await fetch(API_URL.concat('/auth/session'), {
    method: 'GET',
    headers: {
      cookie: cookie ?? '',
    },
    credentials: 'include',
  })

  let session: Session | null = null; 
  if(res.ok) {
    session = await res.json();
  } else {
    console.error('Failed to fetch session', res.status);
  }

  return {
    session,
  };
}

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
