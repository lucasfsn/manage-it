import { ErrorResponse } from '@/app/shared/dto/error-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleApiError(err: HttpErrorResponse): Observable<never> {
  return throwError(() => err.error as ErrorResponse);
}
