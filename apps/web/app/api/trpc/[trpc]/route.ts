import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';
import { NextRequest } from 'next/server';

const rh = (request: NextRequest) => fetchRequestHandler({
  endpoint: '/api/trpc',
  req: request,
  router: appRouter,
  createContext
}); 

export { rh as GET, rh as POST};
