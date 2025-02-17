import { HttpRequestBuilder } from "@anthony-bonta-gaf-energy/fluent-sample-common";

export const FluentService$ = Symbol();

export interface FluentService {
  api(): Promise<string>;
  workspace(): Promise<string>;
  templates(): Promise<string>;

  request(endpoint: string): Promise<HttpRequestBuilder>;
}
