import React from "react";
import { PageContextProvider } from "src/hooks/usePageContext";
import type { PageContext } from "./types";
import { ChakraProvider } from "@chakra-ui/react";
import theme, { getColorModeManager } from "./theme";
import { ColorModeToggle } from "src/components/colormode";
export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  // undefined on the first ssr visit (no cookie)
  const { colorModeManager, initialColorMode } =
    getColorModeManager(pageContext);

  theme.config.initialColorMode = initialColorMode;

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
          <ColorModeToggle />
          {children}
        </ChakraProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}
