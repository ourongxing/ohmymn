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

type MaybeArray<T> = T | T[]
type Include<T, U extends string> = T extends `${infer L}${U}${infer R}`
  ? T
  : never
type MaybePromise<T> = T | Promise<T>

type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

type PickKeyByValue<T, ValueType> = keyof PickByValue<T, ValueType>

type PickByValueExact<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: [ValueType] extends [T[Key]]
      ? [T[Key]] extends [ValueType]
        ? Key
        : never
      : never
  }[keyof T]
>

type Tuple<T, N extends number, R extends T[] = []> = R["length"] extends N
  ? R
  : Tuple<T, N, [T, ...R]>

// type IsObjectLiteral<T> = keyof T extends never
//   ? false
//   : keyof T extends "length"
//   ? false
//   : true

// type x = IsObjectLiteral<[1, 2, 3, 4]>

// type DeepReadonly<T> = {
//   [P in keyof T]: IsObjectLiteral<T[P]> extends true
//     ? DeepReadonly<T[P]>
//     : T[P] extends (infer R)[]
//     ? readonly R[]
//     : T[P]
// }

// type Test2<T> = T extends Record<string, any>
//   ? T extends infer O
//     ? {
//         [K in keyof O]: O[K] extends string[] & { length: infer L }
//           ? O[K] & { length: L }
//           : Test2<O[K]>
//       }
//     : never
//   : T
