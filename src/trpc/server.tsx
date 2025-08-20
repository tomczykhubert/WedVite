import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createQueryClient } from "./query-client";
import { appRouter, AppRouter } from "./routers/_app";
import { createTRPCContext } from "./init";
import { headers } from "next/headers";
// const createContext = cache(createTRPCContext);
const getQueryClient = cache(createQueryClient);

// export const trpc = createTRPCOptionsProxy<AppRouter>({
//   router: appRouter,
//   ctx: await createTRPCContext({headers: await headers()}),
//   queryClient: getQueryClient,
// });

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
