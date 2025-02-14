import { cloneDeep } from 'lodash';

export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put';
export type HttpHeader = string[] | boolean | number | string | null;

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers: Record<string, HttpHeader>;
  body?: unknown;
  params?: unknown;
}

export class HttpRequestBuilder {
  private $request: HttpRequest;

  public constructor() {
    this.$request = {
      method: 'get',
      url: 'localhost',
      headers: {},
    };
  }

  public method(verb: HttpMethod, body?: unknown): this {
    this.$request.method = verb;
    this.$request.body = body;

    if (body == null) {
      delete this.$request.body;
    }

    return this;
  }

  public delete = this.method.bind(this, 'delete', undefined);
  public get = this.method.bind(this, 'get', undefined);
  public patch = this.method.bind(this, 'patch');
  public post = this.method.bind(this, 'post');
  public put = this.method.bind(this, 'put');

  public url(endpoint: string): this {
    this.$request.url = endpoint;

    return this;
  }

  public headers(headers: Record<string, HttpHeader>): this {
    this.$request.headers = headers;

    return this;
  }

  public header(key: string, value: HttpHeader): this {
    return this.headers({ ...this.$request.headers, [key]: value });
  }

  public auth(bearer: string): this {
    return this.header('Authorization', `Bearer ${bearer}`);
  }

  public contentType(type: string): this {
    return this.header('Content-Type', type);
  }

  public accept(type: string): this {
    return this.header('Accept', type);
  }

  public copy(other: HttpRequest) {
    this.$request = cloneDeep(other);

    return this;
  }

  public params(params: unknown): this {
    this.$request.params = params;

    return this;
  }

  public build(): HttpRequest {
    return cloneDeep(this.$request);
  }
}
