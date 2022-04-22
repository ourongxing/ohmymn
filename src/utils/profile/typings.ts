export const enum Range {
  All,
  Doc,
  Global,
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

export const enum ManageProfilePart {
  All,
  Global1,
  Global2,
  Global3,
  Global4,
  Global5,
  Doc,
  Notebook
}
