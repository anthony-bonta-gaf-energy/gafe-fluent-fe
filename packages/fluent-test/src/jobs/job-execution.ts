export interface IJobExecution {
  run(context: any): Promise<void>;
}
