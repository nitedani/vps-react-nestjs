import { HttpAdapterHost, Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { SSRController } from "./ssr.controller";

@Module({
  controllers: [SSRController, ApiController],
  imports: [],
})
export class AppModule {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    console.log("httpAdapterHost", httpAdapterHost);
  }
}
