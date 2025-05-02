import { JobDtoCreate } from "./job-dto-create.mjs";

export enum JobName {
  DoNothing = "do-nothing",
  GenerateIdentityPdf = "generate-identity-pdf",
}

export interface Job {
  id?: string;
  name: JobName;
  context: any;
}

export class JobBuilder {
  private _job: Job;

  public constructor() {
    this._job = {
      name: JobName.DoNothing,
      context: {},
    };
  }

  public name(name: JobName) {
    this._job.name = name;

    return this;
  }

  public context(context: any) {
    this._job.context = context;

    return this;
  }

  public fromCreate(dto: JobDtoCreate) {
    return this.name(dto.name).context(dto.context);
  }

  public build() {
    return structuredClone(this._job);
  }
}
