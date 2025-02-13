import { FetchQueryOptions } from "@tanstack/react-query";

import { SESSION_QUERY_KEY, GetSessionResponseData } from "types/session";
import { config } from "config/configClient";

export const getSessionQuery: FetchQueryOptions<GetSessionResponseData, Error> = {
  queryKey: SESSION_QUERY_KEY,
  queryFn: async () => {
    const response = await fetch(config.api.rest.url.concat('/auth/session'), {
      method: 'GET',
      credentials: 'include',
    });
    const { data: session } = await response.json();
    return session;
  },
}