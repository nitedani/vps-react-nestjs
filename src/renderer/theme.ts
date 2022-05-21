import {
  ColorMode,
  cookieStorageManager,
  cookieStorageManagerSSR,
  extendTheme,
  StorageManager,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { PageContext } from "./types";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "#161616")(props),
    },
  }),
};

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: (props) => ({
      dialog: {
        bg: mode("white", "#161616")(props),
      },
    }),
  },
  Modal: {
    // setup light/dark mode component defaults
    baseStyle: (props) => ({
      dialog: {
        bg: mode("white", "#161616")(props),
      },
    }),
  },
};

const colors = {};

const theme = extendTheme(
  {
    components,
    styles,
    colors,
  },
  { config: { useSystemColorMode: "system" } },
  withDefaultColorScheme({ colorScheme: "cyan" })
);

export const getColorModeManager = (pageContext: PageContext) => {
  let colorModeManager: StorageManager | undefined = undefined;
  let initialColorMode: ColorMode | undefined = undefined;

  if (import.meta.env.SSR) {
    const { req, res } = pageContext;
    const cookie = req.headers["cookie"];
    if (cookie) {
      colorModeManager = cookieStorageManagerSSR(cookie);
      initialColorMode = colorModeManager.get();
    } else {
      res.set({
        "Accept-CH": "Sec-CH-Prefers-Color-Scheme",
        Vary: "Sec-CH-Prefers-Color-Scheme",
        "Critical-CH": "Sec-CH-Prefers-Color-Scheme",
      });
      const prefersColorScheme = pageContext.req.get(
        "sec-ch-prefers-color-scheme"
      );

      if (
        prefersColorScheme &&
        ["light", "dark"].includes(prefersColorScheme)
      ) {
        initialColorMode = prefersColorScheme as ColorMode;
        res.cookie("chakra-ui-color-mode", initialColorMode);
      }
    }
  } else {
    colorModeManager = cookieStorageManager;
    initialColorMode = colorModeManager.get();
  }

  return {
    colorModeManager,
    initialColorMode,
  };
};

export default theme;
