import { HttpAdapterHost, Module } from "@nestjs/common";
import { AppController } from "./app.controller";

@Module({
  controllers: [AppController],
  imports: [],
})
export class AppModule {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    console.log("httpAdapterHost", httpAdapterHost);
  }
}
