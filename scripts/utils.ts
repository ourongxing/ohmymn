export function defineMainfest(mainfest: Mainfest) {
  return mainfest
}

interface Mainfest {
  key: string
  author: string
  title: string
  version: string
  github?: string
  minMarginNoteVersion: string
  profileKey: {
    global: string
    doc: string
    notebook: string
  }
  color: {
    border: string
    button: string
  }
  /** Chinese forum url */
  forumZH?: string
  forum?: string
  docZH?: string
  doc?: string
  files?: string[]
}
