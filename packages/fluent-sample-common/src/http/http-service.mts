import { HttpRequest } from "./http-request.mjs";
import { HttpResponse } from "./http-response.mjs";

export interface HttpService {
  request<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
