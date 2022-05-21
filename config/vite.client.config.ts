import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vite";
import { join } from "path";

const config: UserConfig = {
  plugins: [tsconfigPaths({ root: join(__dirname, "..") }), react(), ssr()],
  build: {
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
    outDir: "dist/",
  },
};

export default config;
