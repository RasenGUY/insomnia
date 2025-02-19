import { initTRPC } from '@trpc/server';
import { createContext } from './context';
const t = initTRPC.context<typeof createContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
t.procedure.use((opts) => {
  return opts.next(
    {
      ...opts,
    }
  );
});
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;