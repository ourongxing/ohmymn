import { author, version } from "package.json"
import { defineManifest } from "scripts/utils"

export default defineManifest({
  author,
  version,
  key: "metadata",
  title: "Metadata",
  minMarginNoteVersion: "3.7.21",
  profileKey: {
    global: "metadata_profile_global",
    doc: "metadata_profile_doc",
    notebook: "metadata_profile_notebook"
  },
  color: {
    border: "#8A95A2",
    button: "#8A95A2"
  },
  github: "https://github.com/ourongxing/ohmymn/packages/metadata",
  forumZH: "https://bbs.marginnote.cn/t/topic/20501",
  forum: "https://forum.marginnote.com/t/5883",
  docZH: "https://ohmymn.marginnote.cn",
  doc: "https://ohmymn.marginnote.cn/en",
  files: ["assets/logo.png", "assets/icon/"]
})
