import { dirname, join } from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { fileURLToPath } from "url";
import WebpackMessages from "webpack-messages";
import webpack from "webpack";
const __dirname = dirname(fileURLToPath(import.meta.url));

process.env.NODE_ENV = "production";

const config = {
  stats: "errors-only",
  entry: join(__dirname, "..", "server", "main.ts"),
  mode: "production",
  target: "node",
  output: {
    path: join(__dirname, "..", "dist"),
    filename: "main.mjs",
    chunkFormat: "module",
  },

  experiments: {
    outputModule: true,
    topLevelAwait: true,
  },
  ignoreWarnings: [
    /^(?!CriticalDependenciesWarning$)|CommonJsRequireContextDependency/,
  ],
  externalsType: "module",
  externalsPresets: { node: true },
  module: {
    parser: {
      javascript: { importMeta: false },
    },
    rules: [
      {
        test: /\.ts$/,
        loader: "swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              // tsx: true, // If you use react
              dynamicImport: true,
              decorators: true,
            },
            target: "es2022",
            transform: {
              decoratorMetadata: true,
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".cjs", ".mjs", ".json"],
    plugins: [
      //@ts-ignore
      new TsconfigPathsPlugin({
        configFile: join(__dirname, "..", "tsconfig.json"),
      }),
    ],
  },
  optimization: {
    minimize: true,
    nodeEnv: "production",
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          "@nestjs/microservices",
          "@nestjs/websockets",
          "@nestjs/websockets/socket-module",
          "@nestjs/microservices/microservices-module",
          "cache-manager",
          "class-transformer",
          "class-validator",
          "fastify-swagger",
          "fastify-static",
          "point-of-view",
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          });
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
    new WebpackMessages({
      name: "server",
      logger: (str) => {
        console.log(`>> ${str}`);
      },
    }),
  ],
};

export default config;
