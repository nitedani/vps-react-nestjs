import { Controller, Get, Req, Res } from "@nestjs/common";
import { renderPage } from "vite-plugin-ssr";

let i = 2;
@Controller()
export class AppController {
  @Get("/api/hello")
  getHello() {
    return i++;
  }

  @Get('*')
  async wildcard(@Req() req, @Res() res){
    const url = req.originalUrl;
    const pageContextInit = {
      url,
      req,
      res,
      reactQueryState: {},
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return;
    const { statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType);
    httpResponse.pipe(res);
  }
}
