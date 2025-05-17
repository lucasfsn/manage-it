import { ErrorResponse } from '@/app/shared/dto/error-response.model';
import { HttpErrorResponse } from '@angular/common/http';

export function extractApiError(err: HttpErrorResponse): ErrorResponse {
  return err.error as ErrorResponse;
}
