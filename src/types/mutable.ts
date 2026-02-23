export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export function mutable<T>(s: T): Mutable<T> {
    return s as any
}