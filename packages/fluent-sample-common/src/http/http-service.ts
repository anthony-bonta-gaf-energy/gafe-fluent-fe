import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface HttpService {
  request<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
