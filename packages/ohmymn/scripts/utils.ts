export function defineManifest(manifest: Manifest) {
  return manifest
}

interface Manifest {
  /**
   * Unique identifier of the addon. Not need "marginnote.extension.".
   */
  key: string
  author: string
  title: string
  version: string
  /**
   * Github repository url.
   */
  github?: string
  /**
   * The minimum version of MarginNote that the addon supports.
   */
  minMarginNoteVersion: string
  /**
   * Profile key, used to save addon settings.
   */
  profileKey?: {
    global: string
    doc: string
    notebook: string
  }
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
