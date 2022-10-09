export const mainfest: Mainfest = {
  author: "MarginNote(ourongxing)",
  key: "ohmymn",
  title: "OhMyMN",
  version: "4.0.9",
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
  forumZH: "https://bbs.marginnote.cn/t/topic/20501",
  docZH: "https://ohmymn.marginnote.cn",
  doc: "https://ohmymn.marginnote.com",
  files: [
    "assets/logo.png",
    "assets/icon",
    "assets/AutoSimplifyData.json"
    // "assets/AutoCompleteData.db"
    // "assets/AutoCompleteData.zip"
  ]
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
