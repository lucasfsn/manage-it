export interface Response<T> {
  code: string;
  message: string;
  timestamp: string;
  data: T;
}
