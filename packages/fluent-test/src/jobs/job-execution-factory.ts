import { Injectable } from "@nestjs/common";
import { IJobExecution } from "./job-execution";
import { JobExecutionDoNothing } from "./job-execution-do-nothing";
import { JobExecutionGenerateIdentityPdf } from "./job-execution-generate-pdf";
import { JobName } from "./job.mjs";

export const JobExecutionFactoryToken = Symbol();

export interface IJobExecutionFactory {
  get(name: JobName): Promise<IJobExecution>;
}

@Injectable()
export class JobExecutionFactory implements IJobExecutionFactory {
  private static readonly mapper: Record<JobName, IJobExecution> = {
    [JobName.DoNothing]: new JobExecutionDoNothing(),
    [JobName.GenerateIdentityPdf]: new JobExecutionGenerateIdentityPdf(),
  };

  public get(name: JobName): Promise<IJobExecution> {
    return Promise.resolve(JobExecutionFactory[name]);
  }
}
