export interface Response<T> {
  readonly code: string;
  readonly message: string;
  readonly timestamp: string;
  readonly data: T;
}
