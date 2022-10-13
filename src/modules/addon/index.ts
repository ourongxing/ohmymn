import { Addon } from "~/addon"
import { MN } from "marginnote"
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
      help: lang.profile.help,
      key: "profile",
      type: CellViewType.Select,
      option: lang.profile.$option5,
      label: lang.profile.label
    },
    {
      label: lang.quick_switch.label,
      key: "quickSwitch",
      type: CellViewType.MuiltSelect,
      option: []
    },
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
      option: lang.panle_control.$option3,
      label: lang.panle_control.label
    },
    {
      key: "hasTitleThen",
      type: CellViewType.Select,
      label: lang.has_title_then.label,
      help: lang.has_title_then.help,
      option: lang.has_title_then.$option3,
      bind: ["quickSwitch", [2, 3, 4]]
    },
    {
      key: "removeExcerpt",
      type: CellViewType.Select,
      label: lang.remove_excerpt.label,
      option: lang.remove_excerpt.$option3,
      help: lang.remove_excerpt.help,
      bind: [
        ["quickSwitch", [2, 3, 4]],
        ["hasTitleThen", [1, 2]]
      ]
    },
    {
      key: "lockExcerpt",
      type: CellViewType.Switch,
      label: lang.lock_excerpt.label
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
