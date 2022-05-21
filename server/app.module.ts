import { Module } from "@nestjs/common";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { AppController } from "./app.controller";
import { ViteSsrModule } from "./vite-ssr/ssr.module";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

@Module({
  controllers: [AppController],
  imports: [
    ViteSsrModule.forRoot({
      root: join(__dirname, "..", "src"),
      configFile: join(__dirname, "..", "config", "vite.client.config.ts"),
    }),
  ],
})
export class AppModule {}
