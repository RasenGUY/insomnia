'use client';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/server/client';
import {  getUrl } from '@/utils/trpc';

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
    queryClient: QueryClient;
  }>,
) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ], 
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={props.queryClient}>
      <QueryClientProvider client={props.queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}