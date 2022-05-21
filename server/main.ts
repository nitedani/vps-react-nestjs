import { NestFactory } from "@nestjs/core";
import { Express } from "express";
import { AppModule } from "./app.module";
import compression from "shrink-ray-current";
const prod = process.env.NODE_ENV === "production";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (prod) {
    app.enableCors();
    app.use(compression());
  }
  app.setGlobalPrefix("/api");
  await app.init();
  return app.getHttpAdapter().getInstance() as Express;
}

export const viteNodeApp = await bootstrap();
if (prod) {
  const port = process.env.PORT || 3000;
  viteNodeApp.listen(port);
}
