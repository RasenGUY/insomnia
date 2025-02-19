// server/routers/_app.ts
import { router } from '../trpc';
import { sessionRouter } from './session';
import { authRouter } from './auth';

export const appRouter = router({
  session: sessionRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

