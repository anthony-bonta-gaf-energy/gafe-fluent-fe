import axios, { AxiosInstance } from "axios";

import { firstDefined } from "../utils/first/first";
import { HttpRequest } from "./http-request";
import { HttpResponse, HttpResponseBuilder } from "./http-response";
import { HttpService } from "./http-service";

export class HttpServiceAxios implements HttpService {
  public constructor(private $axios: AxiosInstance) {}

  async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    try {
      const response = await this.$axios.request({
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.body,
        params: request.params,
      });

      return new HttpResponseBuilder<T>()
        .data(response.data)
        .status(response.status)
        .build();
    } catch (e: any) {
      const status = firstDefined(500, e.status);

      // If the return content type is html with a 404, then we failed a dns lookup
      // and no actual endpoint was hit.  Otherwise, we actually hit an endpoint and
      // the actual endpoint returned a 404 to us.
      const data =
        e.status === 404 && e.response?.headers["content-type"] === "text/html"
          ? { message: e.message }
          : { ...e.response?.data };

      // Internal errors return additional information that we don't want, primarily
      // the stack trace.  Redact that here to make sure that is never shown to
      // the user.  Even if the server returned this and not from an internal error,
      // we never should be showing stack traces as that is a big security risk.
      delete data.stack;

      return Promise.reject(
        new HttpResponseBuilder().data(data).status(status).build(),
      );
    }
  }
}

export function createDefaultHttpService(): HttpService {
  return new HttpServiceAxios(axios.create());
}
