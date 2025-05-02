import { NotImplementedException } from "@nestjs/common";
import { IJobExecution } from "./job-execution";

export class JobExecutionGenerateIdentityPdf implements IJobExecution {
  run(context: any): Promise<void> {
    throw new NotImplementedException("Method not implemented");
  }
}
