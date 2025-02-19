import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import superjson from 'superjson';

export const STALE_TIME = 30 * 1000;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

let clientQueryClientSingleton: QueryClient;
export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = makeQueryClient();
  }
  return clientQueryClientSingleton;
}
