import { Addon } from "~/addon"
import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import lang from "./lang"

export default defineConfig({
  name: Addon.title,
  key: "addon",
  link: Addon.forum,
  intro: lang.intro,
  settings: [
    {
      key: "panelPosition",
      type: CellViewType.Select,
      option: lang.panel_position.$option6,
      label: lang.panel_position.label
    },
    {
      key: "panelHeight",
      type: CellViewType.Select,
      option: lang.panel_height.$option3,
      label: lang.panel_height.label
    },
    {
      key: "panelControl",
      type: CellViewType.MuiltSelect,
      option: lang.panle_control.$option2,
      label: lang.panle_control.label
    },
    {
      key: "doubleLink",
      type: CellViewType.Switch,
      label: lang.double_link
    },
    {
      key: "autoBackup",
      type: CellViewType.Switch,
      label: lang.auto_backup.label
    },
    {
      key: "backupID",
      type: CellViewType.Input,
      help: lang.backup_ID.help,
      bind: ["autoBackup", true],
      check: ({ input }) => {
        const noteid = input.replace("marginnote3app://note/", "")
        if (noteid === input) throw lang.backup_ID.not_link
        const node = MN.db.getNoteById(noteid)
        if (!node) throw lang.backup_ID.not_exit
        if (!node.childNotes?.length) throw lang.backup_ID.no_child
      }
    }
  ]
})
