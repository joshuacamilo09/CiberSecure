import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest<
      Request & {
        method: string;
        originalUrl?: string;
        url: string;
      }
    >();

    const method = request.method;
    const url = request.originalUrl ?? request.url;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(`${method} ${url} ${duration}ms`);
      }),
    );
  }
}
