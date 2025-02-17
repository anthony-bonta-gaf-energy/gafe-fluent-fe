import {
  HttpService,
  HttpService$,
} from "@anthony-bonta-gaf-energy/fluent-sample-common";
import { Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { FluentService, FluentService$ } from "../fluent/fluent-service.mjs";
import { Template } from "./template.mjs";
import { TemplatesService } from "./templates-service.mjs";

@Injectable()
export class TemplatesServiceFluent implements TemplatesService {
  public constructor(
    @Inject(HttpService$) private _http: HttpService,
    @Inject(FluentService$) private _fluent: FluentService,
  ) {}

  async list(): Promise<Template[]> {
    const request = await this._fluent.templates();
    throw new NotImplementedException("Method not implemented.");
  }

  get(): Promise<Template> {
    throw new NotImplementedException("Method not implemented.");
  }
}
