import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
} from "class-validator";
import { JobName } from "./job.mjs";

export class JobDtoCreate {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(JobName))
  name: JobName;

  @IsObject()
  @IsDefined()
  context: any;
}
