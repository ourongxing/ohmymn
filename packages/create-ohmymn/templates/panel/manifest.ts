import { author, version } from "package.json"
import { defineManifest } from "scripts/utils"

export default defineManifest({
  author,
  version,
  key: "template-panel",
  title: "Template Panel",
  minMarginNoteVersion: "3.7.21",
  profileKey: {
    global: "template_panel_profile_global",
    doc: "template_panel_profile_doc",
    notebook: "template_panel_profile_notebook"
  },
  color: {
    border: "#8A95A2",
    button: "#8A95A2"
  },
  files: ["assets/logo.png"]
})
