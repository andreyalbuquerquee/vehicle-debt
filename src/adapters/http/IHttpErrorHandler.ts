import type { IHttpResponse } from './IHttpResponse';

export interface Data<T = any> {
  data: T;
}

export interface IHttpErrorHandler {
  handle(error: unknown): IHttpResponse;
}
