import { IJobExecution } from "./job-execution";

export class JobExecutionDoNothing implements IJobExecution {
  run(): Promise<void> {
    return Promise.resolve();
  }
}
