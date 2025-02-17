import {
  HttpService$,
  HttpServiceAxios,
} from "@anthony-bonta-gaf-energy/fluent-sample-common";
import { Module } from "@nestjs/common";

@Module({
  providers: [{ provide: HttpService$, useClass: HttpServiceAxios }],
  exports: [HttpService$],
})
export class HttpModule {}
