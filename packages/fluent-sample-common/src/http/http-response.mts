import { cloneDeep } from "lodash-es";

export interface HttpResponse<T> {
  status: number;
  data?: T;
}

export class HttpResponseBuilder<T> {
  private $response: HttpResponse<T>;

  public constructor() {
    this.$response = {
      status: 200,
    };
  }

  public data(data?: T): this {
    this.$response.data = data;

    return this;
  }

  public status(status: number): this {
    this.$response.status = status;

    return this;
  }

  public build(): HttpResponse<T> {
    return cloneDeep(this.$response);
  }
}
