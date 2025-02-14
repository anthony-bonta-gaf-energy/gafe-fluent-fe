import { SupplierAsync } from "../function/supplier.mjs";

export class Lazy<T> {
  private _value: Promise<T>;

  public constructor(private _factory: SupplierAsync<T>) {}

  public initialized() {
    return this._value != null;
  }

  public async get() {
    if (this._value == null) {
      this._value = this._factory();
    }

    return this._value;
  }
}
