import { useQuery as _useQuery, useQueryClient, dehydrate } from "react-query";
import { usePageContext } from "./usePageContext";

// proof of concept
function useQuery<T>(
  key: string,
  queryFn: () => Promise<T>
): { data: T | undefined } {
  const { data } = _useQuery(key, queryFn, {
    staleTime: 2000,
  });
  if (import.meta.env.SSR) {
    const queryClient = useQueryClient();
    const ctx = usePageContext();
    const dehydratedState = dehydrate(queryClient);
    Object.assign(ctx.reactQueryState, dehydratedState);
  }
  return { data };
}
