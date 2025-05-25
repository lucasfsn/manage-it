interface FieldValidationError {
  readonly errorCode: string;
  readonly field: string;
  readonly message: string;
}

export interface ErrorResponse {
  readonly code: number;
  readonly message: string;
  readonly timestamp: string;
  readonly data: FieldValidationError[] | null;
}
