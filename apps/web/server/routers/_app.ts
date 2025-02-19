import { router } from '../trpc';
import { sessionRouter } from './session';
import { authRouter } from './auth';
import { resolverRouter } from './resolver';

export const appRouter = router({
  session: sessionRouter,
  auth: authRouter,
  resolver: resolverRouter,
});

export type AppRouter = typeof appRouter;

