import { author, version } from "package.json"
import { defineManifest } from "scripts/utils"

export default defineManifest({
  author,
  version,
  key: "export2anywhere",
  title: "Export to Anywhere",
  minMarginNoteVersion: "3.7.21",
  profileKey: {
    global: "export2anywhere_profile_global",
    doc: "export2anywhere_profile_doc",
    notebook: "export2anywhere_profile_notebook"
  },
  color: {
    border: "#8A95A2",
    button: "#8A95A2"
  },
  github: "https://github.com/ourongxing/ohmymn/packages/export2anywhere",
  forumZH: "https://bbs.marginnote.cn/t/topic/20501",
  forum: "https://forum.marginnote.com/t/5883",
  docZH: "https://ohmymn.marginnote.cn",
  doc: "https://ohmymn.marginnote.cn/en",
  files: ["assets/logo.png", "assets/icon/"]
})
