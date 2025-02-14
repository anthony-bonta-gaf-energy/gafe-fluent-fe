function firstBy<T>(
  predicate: (v: T) => boolean,
  fallback: T,
  ...values: (T | null | undefined)[]
): T {
  for (const value of values) {
    if (value != null && predicate(value)) {
      return value;
    }
  }

  return fallback;
}

export function firstTruthy<T>(fallback: T, ...rest: (T | null | undefined)[]) {
  return firstBy<T>(v => Boolean(v), fallback, ...rest);
}

export function firstDefined<T>(fallback: T, ...rest: (T | null | undefined)[]) {
  return firstBy<T>(v => v != null, fallback, ...rest);
}
