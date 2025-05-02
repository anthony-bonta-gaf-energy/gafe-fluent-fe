import { Module } from "@nestjs/common";
import { RunModule } from "../run/run-module.mjs";

@Module({
  imports: [RunModule],
})
export class AppModule {}
