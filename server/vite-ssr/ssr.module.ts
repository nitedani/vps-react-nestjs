import "reflect-metadata";
import { DynamicModule, Inject, Module, OnModuleInit } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { renderPage } from "vite-plugin-ssr";
import { createRequire } from "module";
import path, { join } from "path";
import { fileURLToPath } from "url";
import express from "express";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OPTIONS = Symbol.for("vite-plugin-ssr.options");
const prod = process.env.NODE_ENV === "production";
import type { createServer as CreateServerType } from "vite";
interface ViteSsrOptions {
  root: string;
  configFile?: string;
}

@Module({})
export class ViteSsrModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(OPTIONS)
    private readonly viteSsrOptions: ViteSsrOptions
  ) {}

  static forRoot(options: ViteSsrOptions): DynamicModule {
    return {
      module: ViteSsrModule,
      providers: [{ provide: OPTIONS, useValue: options }],
    };
  }

  async onModuleInit() {
    if (!this.httpAdapterHost) {
      return;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (!httpAdapter) {
      return;
    }
    const app = httpAdapter.getInstance();

    const root = prod ? join(__dirname, "client") : this.viteSsrOptions.root;

    if (!prod) {
      const require = createRequire(import.meta.url);
      const vite = require("vite");
      const viteDevServer = await (
        vite.createServer as typeof CreateServerType
      )({
        root,
        configFile: this.viteSsrOptions.configFile,
        server: { middlewareMode: "ssr" },
      });
      app.use(viteDevServer.middlewares);
    } else {
      app.use(express.static(root));
    }

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      const pageContextInit = {
        url,
        req,
        res,
        reactQueryState: {},
      };
      const pageContext = await renderPage(pageContextInit);
      const { httpResponse } = pageContext;
      if (!httpResponse) return next();
      const { statusCode, contentType } = httpResponse;
      res.status(statusCode).type(contentType);
      httpResponse.pipe(res);
    });
  }
}
