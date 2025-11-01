import type { IHttpRequest } from './IHttpRequest';

export interface IAuthGuard<T> {
  check(request: IHttpRequest): T;
}
