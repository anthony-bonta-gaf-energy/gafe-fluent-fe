import {
  firstDefined,
  HttpRequestBuilder,
  HttpService,
  HttpService$,
  Lazy,
} from "@anthony-bonta-gaf-energy/fluent-sample-common";
import { Inject, Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { FluentService } from "./fluent-service.mjs";

export type FluentApiVersion = 1 | 2;

@Injectable()
export class FluentServiceClient implements FluentService {
  private _token: Lazy<string>;

  public constructor(@Inject(HttpService$) private _http: HttpService) {
    // Not perfect, but this doesn't have to be.  This should
    // really be coming from a vault, not an environment variable
    // but this will do for just a POC.
    config();

    this._token = new Lazy(this.token.bind(this));
  }

  private baseUrl(): Promise<string> {
    const protocol = firstDefined("http", process.env.FLUENT_MANAGER_PROTOCOL);
    const domain = process.env.FLUENT_MANAGER_DOMAIN;

    if (!domain) {
      throw new Error("Domain not found.  Did you forget to configure it?");
    }

    return Promise.resolve(`${protocol}://${domain}/api`);
  }

  public async api(version: FluentApiVersion = 1): Promise<string> {
    return `${await this.baseUrl()}/v${version}`;
  }

  public async workspace(version: FluentApiVersion = 1): Promise<string> {
    const name = firstDefined("Local", process.env.FLUENT_WORKSPACE_NAME);
    return `${await this.api(version)}/workspaces/${atob(name)}`;
  }

  public templates(version: FluentApiVersion = 1): Promise<string> {
    return this.api();
  }

  private async token(): Promise<string> {
    const login = process.env.FLUENT_MANAGER_SERVICE_ACCOUNT_EMAIL;
    const password = process.env.FLUENT_MANAGER_SERVICE_ACCOUNT_PASSWORD;
    const endpoint = `${await this.baseUrl()}/v1/authentication`;
    const request = new HttpRequestBuilder()
      .url(endpoint)
      .post({ login, password })
      .build();

    const { data } = await this._http.request<{ accessToken: string }>(request);

    return firstDefined("", data?.accessToken);
  }

  public async request(endpoint: string): Promise<HttpRequestBuilder> {
    const token = await this._token.get();

    return new HttpRequestBuilder()
      .url(endpoint)
      .header("Authorization", `Bearer ${token}`);
  }
}
