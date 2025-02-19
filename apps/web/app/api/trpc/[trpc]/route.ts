import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';
import { NextRequest } from 'next/server';

const handler = (request: NextRequest) => fetchRequestHandler({
  endpoint: '/api/trpc',
  req: request,
  router: appRouter,
  createContext
}); 

export { handler as GET, handler as POST};
