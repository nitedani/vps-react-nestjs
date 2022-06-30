/// <reference types="vavite" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import vavite from "vavite";
import { join } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Compiler, Options } from "@swc/core";
import type { Plugin } from "vite";
import { createFilter } from "@rollup/pluginutils";

function RollupPluginSwc(options: Options): Plugin {
  let swc: Compiler;
  const config: Options = {
    ...options,
  };
  const cleanUrl = (url: string) =>
    url.replace(/#.*$/, "").replace(/\?.*$/, "");
  const filter = createFilter(/\.(tsx?|jsx)$/, /\.js$/);
  return {
    name: "rollup-plugin-swc",
    async transform(code, id) {
      if (filter(id) || filter(cleanUrl(id))) {
        if (!swc) swc = await import("@swc/core");
        const result = await swc.transform(code, {
          ...config,
          filename: id,
        });
        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}

export default defineConfig({
  buildSteps: [
    { name: "client" },
    {
      name: "server",
      config: {
        build: {
          ssr: true,
          rollupOptions: {
            output: {
              // We have to disable this for multiple entries
              inlineDynamicImports: false,
            },
          },
        },
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
    outDir: "dist/",
  },
  optimizeDeps: {
    exclude: [
      "@swc/core",
      "@nestjs/microservices",
      "@nestjs/websockets",
      "cache-manager",
      "class-transformer",
      "class-validator",
      "fastify-swagger",
      "point-of-view",
      "fastify-static",
    ],
  },

  plugins: [
    RollupPluginSwc({
      jsc: {
        parser: {
          syntax: "typescript",
          dynamicImport: true,
          decorators: true,
        },
        target: "es2021",
        transform: {
          // important for nestjs
          decoratorMetadata: true,
        },
      },
    }),
    tsconfigPaths({ root: join(__dirname, "..") }),
    vavite({
      serverEntry: join(__dirname, "..", "server", "main.ts"),
      //important for hot reload
      serveClientAssetsInDev: true,
    }),
    react(),
    ssr(),

    // The following hack is necessary because vite-plugin-import-build
    // (which is used by vite-plugin-ssr) has some deduplication logic
    // that doesn't play well with vavite's multiple builds.
    {
      name: "vite-plugin-import-build-hack",
      enforce: "post",
      closeBundle() {
        delete (global as any)["__vite-plugin-import-build:config"];
      },
    },
  ],
});
