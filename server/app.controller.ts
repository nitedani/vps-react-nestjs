import { Controller, Get } from "@nestjs/common";

let i = 0;
@Controller()
export class AppController {
  constructor() {}

  @Get("/hello")
  getHello() {
    return i++;
  }
}
