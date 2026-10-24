import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  { success: true; data: T }
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: true; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
