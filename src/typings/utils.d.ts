// https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

/** Expand all properties */
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

type AnyProperty<T> = Record<string, T>
type Include<T, U extends string> = T extends `${infer L}${U}${infer R}`
  ? T
  : never
type MaybePromise<T> = T | Promise<T>
