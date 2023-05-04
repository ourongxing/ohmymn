import type { ReplaceParam } from "~/utils"
import type {
  defaultDocProfile,
  defaultGlobalProfile,
  defaultNotebookProfile
} from "./default"

export const enum Range {
  All,
  Doc,
  Global,
  Notebook
}

export const enum RewriteRange {
  Doc,
  AllGlobal,
  SingleGlobal,
  Notebook
}

export type ReadPrifile = ({
  range,
  docmd5,
  notebookid,
  profileNO
}:
  | {
      range: Range.All
      docmd5: string
      notebookid: string
      profileNO?: number
    }
  | {
      range: Range.Notebook
      notebookid: string
      profileNO?: number
      docmd5?: string
    }
  | {
      range: Range.Doc
      docmd5: string
      profileNO?: number
      notebookid?: string
    }
  | {
      range: Range.Global
      profileNO: number
      docmd5?: string
      notebookid?: string
    }) => void

export type WritePrifile = ({
  range,
  docmd5,
  notebookid,
  profileNO
}:
  | {
      range: Range.All
      docmd5: string
      notebookid: string
      profileNO?: number
    }
  | {
      range: Range.Notebook
      notebookid: string
      profileNO?: number
      docmd5?: string
    }
  | {
      range: Range.Doc
      docmd5: string
      notebookid?: string
      profileNO?: number
    }
  | {
      range: Range.Global
      profileNO: number
      docmd5?: string
      notebookid?: string
    }) => void

export const enum ManageProfileItems {
  All,
  Global1,
  Global2,
  Global3,
  Global4,
  Global5,
  AllGlobal,
  Doc,
  Notebook
}

export interface RewriteCase {
  version: {
    from: string
    to: string
  }
  global?: {
    [key in keyof IGlobalProfile]?: Partial<
      Record<
        key extends "addon"
          ?
              | "cardAction"
              | "textAction"
              | PickKeyByValue<IGlobalProfile[key], number[]>
          : PickKeyByValue<IGlobalProfile[key], number[]>,
        (old: number[], thisProfile: IGlobalProfile) => number[]
      >
    > &
      Partial<
        Record<
          PickKeyByValue<IGlobalProfile[key], string>,
          (old: string, thisProfile: IGlobalProfile) => string
        >
      > &
      Partial<
        Record<
          PickKeyByValue<IGlobalProfile[key], boolean>,
          (old: boolean, thisProfile: IGlobalProfile) => boolean
        >
      >
  }
  doc?: {
    [key in keyof IDocProfile]?: Partial<
      Record<
        PickKeyByValue<IDocProfile[key], number[]>,
        (old: number[], thisProfile: IDocProfile) => number[]
      >
    > &
      Partial<
        Record<
          PickKeyByValue<IDocProfile[key], string>,
          (old: string, thisProfile: IDocProfile) => string
        >
      > &
      Partial<
        Record<
          PickKeyByValue<IDocProfile[key], boolean>,
          (old: boolean, thisProfile: IDocProfile) => boolean
        >
      >
  }
  notebook?: {
    [key in keyof INotebookProfile]?: Partial<
      Record<
        PickKeyByValue<INotebookProfile[key], number[]>,
        (old: number[], thisProfile: INotebookProfile) => number[]
      >
    > &
      Partial<
        Record<
          PickKeyByValue<INotebookProfile[key], string>,
          (old: string, thisProfile: INotebookProfile) => string
        >
      > &
      Partial<
        Record<
          PickKeyByValue<INotebookProfile[key], boolean>,
          (old: boolean, thisProfile: INotebookProfile) => boolean
        >
      >
  }
}

type UtilTemp<T> = {
  [K in keyof T]: K extends "replaceParam"
    ? {
        [M in keyof T[K]]: ReplaceParam[] | undefined
      }
    : {
        [M in keyof T[K]]: RegExp[][] | undefined
      }
}

type UtilProfile<T> = {
  [K in keyof T]: K extends "additional"
    ? T[K]
    : {
        [M in keyof T[K]]: T[K][M] extends any[] ? number[] : T[K][M]
      }
}

export type IGlobalProfile = UtilProfile<typeof defaultGlobalProfile>
export type IDocProfile = UtilProfile<typeof defaultDocProfile>
export type INotebookProfile = UtilProfile<typeof defaultNotebookProfile>
export type IAllProfile = IGlobalProfile & IDocProfile & INotebookProfile
