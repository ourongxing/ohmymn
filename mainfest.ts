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
  bbs?: string
  /** English forum url */
  forum?: string
}

export const mainfest: Mainfest = {
  author: "MarginNote(ourongxing)",
  key: "ohmymn",
  title: "OhMyMN",
  version: "4.0.5",
  minMarginNoteVersion: "3.7.18",
  profileKey: {
    global: "ohmymn_profile_global_v4",
    doc: "ohmymn_profile_doc_v4",
    notebook: "ohmymn_profile_notebook_v4"
  },
  color: {
    border: "#8A95A2",
    button: "#8A95A2"
  },
  github: "https://github.com/marginnoteapp/ohmymn",
  bbs: "https://bbs.marginnote.cn/t/topic/20501"
}
