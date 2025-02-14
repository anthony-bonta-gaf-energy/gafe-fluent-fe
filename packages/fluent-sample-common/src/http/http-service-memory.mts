import { get } from "lodash";

import { firstDefined } from "../utils/first/first.mjs";
import { HttpMethod, HttpRequest } from "./http-request.mjs";
import { HttpResponse, HttpResponseBuilder } from "./http-response.mjs";
import { HttpService } from "./http-service.mjs";

type HttpResponseFactory = (
  req: HttpRequest,
) => HttpResponse<unknown> | Promise<HttpResponse<unknown>>;

export class HttpServiceMemory implements HttpService {
  private static createEmptyMapping(): Record<
    HttpMethod,
    HttpResponseFactory | null
  > {
    return {
      get: null,
      post: null,
      delete: null,
      put: null,
      patch: null,
    };
  }

  private $mapping: Record<
    string,
    Record<HttpMethod, HttpResponseFactory | null>
  > = {};

  private mapping(request: HttpRequest) {
    const endpoint = get(this.$mapping, request.url, null);

    if (endpoint == null) {
      return null;
    }

    const factory = get(endpoint, request.method, null);

    if (factory == null) {
      return null;
    }

    return factory;
  }

  public set<TResult = unknown>(
    method: HttpMethod,
    endpoint: string,
    invoke: HttpResponse<TResult> | HttpResponseFactory,
  ) {
    this.$mapping[endpoint] = firstDefined(
      HttpServiceMemory.createEmptyMapping(),
      this.$mapping[endpoint],
    );

    this.$mapping[endpoint][method] =
      typeof invoke === "function" ? invoke : () => invoke;
  }

  public async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const result = this.mapping(request);

    if (result == null) {
      const data = { message: "DNS Lookup Failed" };
      const notFound = new HttpResponseBuilder().status(404).data(data).build();

      return Promise.reject(notFound);
    }

    const errorThreshold = 400;
    const intermediate = await result(request);

    return Number(intermediate.status) < errorThreshold
      ? Promise.resolve(intermediate as HttpResponse<T>)
      : Promise.reject(intermediate);
  }
}
