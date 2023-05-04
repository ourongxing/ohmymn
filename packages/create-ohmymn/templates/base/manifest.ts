import { author, version } from "package.json"
import { defineManifest } from "scripts/utils"

export default defineManifest({
  author,
  version,
  key: "template-base",
  title: "Template Base",
  minMarginNoteVersion: "3.7.21",
  files: ["assets/logo.png"]
})
