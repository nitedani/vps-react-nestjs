import { Root, hydrateRoot, createRoot } from "react-dom/client";
import { PageShell } from "./PageShell";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client/router";
import type { PageContext } from "./types";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
export { render };

let root: Root | null = null;
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps } = pageContext;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  const page = (
    <PageShell pageContext={pageContext}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageContext.reactQueryState}>
          <Page {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </PageShell>
  );
  const container = document.getElementById("page-view")!;
  if (pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
}
