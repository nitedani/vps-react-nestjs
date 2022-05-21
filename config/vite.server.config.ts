import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vite";
import { join } from "path";
import { VitePluginNode } from "vite-plugin-node";

const config: UserConfig = {
  plugins: [
    tsconfigPaths({ root: join(__dirname, "..") }),
    ...VitePluginNode({
      adapter: "express",
      appPath: join(__dirname, "..", "server", "main.ts"),
      exportName: "viteNodeApp",
      tsCompiler: "swc",
      swcOptions: {
        jsc: {
          parser: {
            syntax: "typescript",
            // tsx: true, // If you use react
            dynamicImport: true,
            decorators: true,
          },
          target: "es2021",
          transform: {
            decoratorMetadata: true,
          },
        },
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
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

  build: {
    emptyOutDir: false,
    rollupOptions: {
      external: ["reflect-metadata"],
      output: {
        format: "esm",
      },
    },
    outDir: join(__dirname, "..", "dist"),
  },
};

export default config;
