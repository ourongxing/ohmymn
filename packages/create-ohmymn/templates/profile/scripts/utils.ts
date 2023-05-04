export function defineManifest(mainfest: Manifest) {
  return mainfest
}

interface Manifest {
  key: string
  author: string
  title: string
  version: string
  github?: string
  minMarginNoteVersion: string
  profileKey?: {
    global: string
    doc: string
    notebook: string
  }
  certKey?: string
  /**
   * Panel color
   */
  color?: {
    border: string
    button: string
  }
  /** Chinese forum url */
  forumZH?: string
  forum?: string
  docZH?: string
  doc?: string
  /** Files to be copied to the addon folder */
  files?: string[]
}
