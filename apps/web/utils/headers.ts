import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function getForwardedHeaders(opts: FetchCreateContextFnOptions) {
  const headers = opts.req.headers;
  return {
    cookie: headers.get('cookie') ?? undefined,
    authorization: headers.get('authorization') ?? undefined,
  };
}

export function createApiHeaders(forwardedHeaders: ReturnType<typeof getForwardedHeaders>) {
  return Object.fromEntries(
    Object.entries({
      ...forwardedHeaders,
    }).filter(([_, value]) => value != null)
  );
}