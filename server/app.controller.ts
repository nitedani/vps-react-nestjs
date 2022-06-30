import { Controller, Get } from "@nestjs/common";

let i = 2;
@Controller()
export class AppController {
  @Get("/hello")
  getHello() {
    return i++;
  }
}
