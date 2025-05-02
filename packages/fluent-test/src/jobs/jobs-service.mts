import { Inject, Injectable } from "@nestjs/common";
import {
  IJobExecutionFactory,
  JobExecutionFactoryToken,
} from "./job-execution-factory";
import { Job } from "./job.mjs";

export const JobsServiceToken = Symbol();

export interface IJobsService {
  run(job: Job): Promise<void>;
}

@Injectable()
export class JobsService implements IJobsService {
  public constructor(
    @Inject(JobExecutionFactoryToken) private _factory: IJobExecutionFactory,
  ) {}

  public async run(job: Job): Promise<void> {
    const execution = await this._factory.get(job.name);
    await execution.run(job.context);
  }
}
