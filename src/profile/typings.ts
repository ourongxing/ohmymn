import { ReplaceParam } from "~/utils"
import {
  defaultDocProfile,
  defaultGlobalProfile,
  defaultNotebookProfile,
  defaultTempProfile
} from "./defaultProfile"

export const enum Range {
  All,
  Doc,
  Global,
  Notebook
}

export type ReadPrifile = (
  {
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
      },
  lastVersion?: string
) => void

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
        (old: number[]) => number[]
      >
    >
  }
  doc?: {
    [key in keyof IDocProfile]?: Partial<
      Record<
        PickKeyByValue<IDocProfile[key], number[]>,
        (old: number[]) => number[]
      >
    >
  }
  notebook?: {
    [key in keyof INotebookProfile]?: Partial<
      Record<
        PickKeyByValue<INotebookProfile[key], number[]>,
        (old: number[]) => number[]
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

export type ITempProfile = UtilTemp<typeof defaultTempProfile>
export type IGlobalProfile = UtilProfile<typeof defaultGlobalProfile>
export type IDocProfile = UtilProfile<typeof defaultDocProfile>
export type INotebookProfile = UtilProfile<typeof defaultNotebookProfile>
export type IAllProfile = IGlobalProfile & IDocProfile & INotebookProfile
