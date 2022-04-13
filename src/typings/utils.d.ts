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

// type Test<T> = Expand<{
//   [K in keyof T]: IsObjectLiteral<T[K]> extends true
//     ? {
//         [M in keyof T[K]]: T[K][M] extends any[] ? readonly string[] : T[K][M]
//       }
//     : T[K] extends any[]
//     ? readonly string[]
//     : T[K]
// }>

// type Test2<T> = T extends Record<string, any>
//   ? T extends infer O
//     ? {
//         [K in keyof O]: O[K] extends readonly string[]
//           ? Tuple<string, O[K]["length"]>
//           : Test<O[K]>
//       }
//     : never
//   : T
