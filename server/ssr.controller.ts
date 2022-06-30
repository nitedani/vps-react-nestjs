import { Controller, Get, Req, Res } from "@nestjs/common";
import { renderPage } from "vite-plugin-ssr";

@Controller()
export class SSRController {
  @Get("*")
  async ssr(@Req() req, @Res() res) {
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
