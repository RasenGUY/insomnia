import { router } from '../trpc';
import { sessionRouter } from './session';
import { authRouter } from './auth';
import { resolverRouter } from './resolver';
import { assetRouter } from './assets'; 

export const appRouter = router({
  session: sessionRouter,
  auth: authRouter,
  resolver: resolverRouter,
  assets: assetRouter,
});

export type AppRouter = typeof appRouter;

