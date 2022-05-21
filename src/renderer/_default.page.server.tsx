import { renderToPipeableStream } from "react-dom/server";
import { PageShell } from "./PageShell";
import { escapeInject } from "vite-plugin-ssr";
import type { PageContext } from "./types";
import type { PageContextBuiltIn } from "vite-plugin-ssr";
import { renderToStream } from "react-streaming/server";
import { QueryClient, QueryClientProvider } from "react-query";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "reactQueryState"];

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  const stream = await renderToStream(
    <PageShell pageContext={pageContext}>
      <QueryClientProvider client={queryClient}>
        <Page {...pageProps} />
      </QueryClientProvider>
    </PageShell>,
    {
      disable: false,
      webStream: false,
      renderToPipeableStream,
    }
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext;
  const title = (documentProps && documentProps.title) || "App";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="description" content="App" />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="height: 100vh;">
        <div id="page-view" style="height: 100%; overflow: hidden;">${stream}</div>
      </body>
    </html>`;

  return {
    documentHtml,
  };
}
