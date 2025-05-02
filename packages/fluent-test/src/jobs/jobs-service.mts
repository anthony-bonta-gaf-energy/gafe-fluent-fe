import { Inject, Injectable } from "@nestjs/common";
import {
  IJobExecutionFactory,
  JobExecutionFactoryToken,
} from "./job-execution-factory";
import { Job, JobBuilder } from "./job.mjs";

export const JobsServiceToken = Symbol();

export interface IJobsService {
  run(job: Job): Promise<Job>;
}

@Injectable()
export class JobsService implements IJobsService {
  public constructor(
    @Inject(JobExecutionFactoryToken) private _factory: IJobExecutionFactory,
  ) {}

  public async run(job: Job): Promise<Job> {
    const jobWithId = new JobBuilder().copy(job).id().build();
    const execution = await this._factory.get(jobWithId.name);
    await execution.run(jobWithId.context);
    return jobWithId;
  }
}
