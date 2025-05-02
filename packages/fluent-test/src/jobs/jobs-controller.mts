import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { JobDtoCreate } from "./job-dto-create.mjs";
import { JobBuilder } from "./job.mjs";
import { JobsService, JobsServiceToken } from "./jobs-service.mjs";

@ApiTags("jobs")
@Controller("jobs")
export class JobsController {
  public constructor(@Inject(JobsServiceToken) private _jobs: JobsService) {}

  @Post()
  @ApiBody({ type: JobDtoCreate })
  public create(@Body() dto: JobDtoCreate) {
    return this._jobs.run(new JobBuilder().fromCreate(dto).build());
  }
}
