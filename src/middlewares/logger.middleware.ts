import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(request: Request, response: Response, next: Function) {
    console.info(request.ip);
    console.info(request.headers['user-agent']);
    console.info(request.headers['cookie']);
    console.info(request.body);
    next();
  }
}
