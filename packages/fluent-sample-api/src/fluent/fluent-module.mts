import { Module } from "@nestjs/common";
import { HttpModule } from "../http/http-module.mjs";
import { FluentServiceClient } from "./fluent-service-client.mjs";
import { FluentService$ } from "./fluent-service.mjs";

@Module({
  imports: [HttpModule],
  providers: [{ provide: FluentService$, useClass: FluentServiceClient }],
  exports: [FluentService$],
})
export class FluentModule {}
