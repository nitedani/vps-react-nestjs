import { NestFactory } from "@nestjs/core";
import type { Express } from "express";
import express from "express";
import compression from "shrink-ray-current";
import httpDevServer from "vavite/http-dev-server";
import { AppModule } from "./app.module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = (await app.getHttpAdapter().getInstance()) as Express;

  if (import.meta.env.PROD) {
    app.enableCors();
    app.use(compression());
    const port = process.env.PORT || 3000;
    app.use(express.static(join(__dirname, "client")));
    app.listen(port);
  } else {
    await app.init();
    httpDevServer!.on("request", expressApp);
  }
}
