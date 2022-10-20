import { MbBookNote, NodeNote } from "marginnote"

export type AutoUtilType = {
  customOCR: ({ imgBase64 }: { imgBase64: string }) => string
  modifyExcerptText: ({
    node,
    note,
    text
  }: {
    node: NodeNote
    note: MbBookNote
    text: string
  }) => string
  generateTitles: ({
    node,
    text,
    note
  }: {
    node: NodeNote
    note: MbBookNote
    text: string
  }) => {
    title: string[]
    text: string
    comments?: string[]
  }
  generateTags: ({
    note,
    node,
    text
  }: {
    note: MbBookNote
    node: NodeNote
    text: string
  }) => string[]
  generateComments: ({
    node,
    note,
    text
  }: {
    note: MbBookNote
    node: NodeNote
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
