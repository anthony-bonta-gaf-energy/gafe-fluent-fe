import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import {
  JobExecutionFactory,
  JobExecutionFactoryToken,
} from "./job-execution-factory";
import { JobsController } from "./jobs-controller.mjs";
import { JobsService, JobsServiceToken } from "./jobs-service.mjs";

@Module({
  imports: [HttpModule],
  controllers: [JobsController],
  providers: [
    { provide: JobsServiceToken, useClass: JobsService },
    { provide: JobExecutionFactoryToken, useClass: JobExecutionFactory },
  ],
})
export class JobsModule {}
