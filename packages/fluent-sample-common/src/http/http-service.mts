import { HttpRequest } from "./http-request.mjs";
import { HttpResponse } from "./http-response.mjs";

export const HttpService$ = Symbol();

export interface HttpService {
  request<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
