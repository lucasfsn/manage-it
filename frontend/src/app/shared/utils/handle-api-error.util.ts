import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleApiError(err: HttpErrorResponse): Observable<never> {
  return throwError((): ErrorResponse => err.error);
}
