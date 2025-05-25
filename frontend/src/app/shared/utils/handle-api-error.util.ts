import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleApiError(err: HttpErrorResponse): Observable<never> {
  if (err.status === 401 && err.url?.includes('authenticate'))
    return throwError(
      (): ErrorResponse => ({
        code: 401,
        message: 'INVALID_AUTH_DATA',
        timestamp: new Date().toISOString(),
      }),
    );

  return throwError((): ErrorResponse => err.error);
}
