import { Module } from "@nestjs/common";
import { FluentModule } from "../fluent/fluent-module.mjs";
import { HttpModule } from "../http/http-module.mjs";
import { TemplatesServiceFluent } from "./template-service-fluent.mjs";
import { TemplatesController } from "./templates-controller.mjs";
import { TemplateService$ } from "./templates-service.mjs";

@Module({
  controllers: [TemplatesController, FluentModule, HttpModule],
  providers: [{ provide: TemplateService$, useClass: TemplatesServiceFluent }],
})
export class TemplatesModule {}
