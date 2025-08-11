/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    this.logger.log(`--> ${method} ${url}`);

    return next.handle().pipe(
      tap((response) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const timeTaken = Date.now() - now;

        this.logger.log(`<-- ${method} ${url} ${statusCode} +${timeTaken}ms`);
      }),
      catchError((err) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode || 500;
        const timeTaken = Date.now() - now;

        this.logger.error(
          `<-- ${method} ${url} ${statusCode} +${timeTaken}ms ERROR: ${err.message}`,
          err.stack,
        );
        throw err;
      }),
    );
  }
}
