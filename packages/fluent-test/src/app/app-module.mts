import { Module } from "@nestjs/common";
import { JobsModule } from "../jobs/jobs-module.mjs";

@Module({
  imports: [JobsModule],
})
export class AppModule {}
