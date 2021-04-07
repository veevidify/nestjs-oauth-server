import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(request: Request, response: Response, next: Function) {
    console.info('== Request Logging Middleware');
    console.info({
      method: request.method,
      url: request.url,
      ip: request.ip,
      ua: request.headers['user-agent'],
      body: request.body,
    });
    next();
  }
}
