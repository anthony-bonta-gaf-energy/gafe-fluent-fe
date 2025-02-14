export type Supplier<T> = () => T;
export type SupplierAsync<T> = Supplier<Promise<T>>;
