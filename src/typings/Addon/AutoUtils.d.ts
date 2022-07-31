import { MbBookNote } from "../MarginNote"

export type AutoUtilType = {
  customOCR: ({ imgBase64 }: { imgBase64: string }) => string
  modifyExcerptText: ({
    note,
    text
  }: {
    note: MbBookNote
    text: string
  }) => string
  generateTitles: ({ note, text }: { note: MbBookNote; text: string }) => {
    title: string[]
    text: string
    comments?: string[]
  }
  generateTags: ({ note, text }: { note: MbBookNote; text: string }) => string[]
  generateComments: ({
    note,
    text
  }: {
    note: MbBookNote
    text: string
  }) => string[]
  modifyTitles: ({ titles }: { titles: string[] }) => string[]
  modifyStyle: ({ note }: { note: MbBookNote }) => {
    color: number | undefined
    style: number | undefined
  }
}

export type TypeUtilIndex<T> = {
  [K in keyof T]?: MaybeArray<
    T[K] extends (...a: any) => infer Ret
      ? ((
          ...a: Parameters<T[K]>
        ) => MaybePromise<Ret | undefined>) extends infer R
        ? R | { index: number; method: R }
        : never
      : never
  >
}

export type TypeUtilFalseArray<T> = {
  [K in keyof T]?: Array<
    T[K] extends (...a: any) => infer Ret
      ? (...a: Parameters<T[K]>) => MaybePromise<Ret | false | undefined>
      : never
  >
}

export type TypeUtilIndexFalseArray<T> = {
  [K in keyof T]?: Array<
    T[K] extends (...a: any) => infer Ret
      ? ((
          ...a: Parameters<T[K]>
        ) => MaybePromise<Ret | false | undefined>) extends infer R
        ? { index: number; method: R }
        : never
      : never
  >
}
