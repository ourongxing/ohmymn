import { Addon } from "~/addon"
import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import lang from "./lang"

const config = defineConfig({
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
      option: lang.panle_control.$option2,
      label: lang.panle_control.label
    },
    {
      key: "dragMerge",
      type: CellViewType.Select,
      label: lang.drag_merge.label,
      option: lang.drag_merge.$option2,
      help: lang.drag_merge.help
    },
    {
      key: "hasTitleThen",
      type: CellViewType.Select,
      label: lang.has_title_then.label,
      option: lang.has_title_then.$option3,
      bind: ["dragMerge", [1, 2]]
    },
    {
      key: "removeExcerpt",
      type: CellViewType.Select,
      label: lang.remove_excerpt.label,
      option: lang.remove_excerpt.$option2,
      bind: ["dragMerge", [1, 2]]
    },
    {
      key: "doubleLink",
      type: CellViewType.Switch,
      label: lang.double_link
    },
    {
      key: "useMarkdown",
      type: CellViewType.Switch,
      label: lang.use_markdown.label,
      help: lang.use_markdown.help
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
        const noteid = input.replace(MN.scheme + "://note/", "")
        if (noteid === input) throw lang.backup_ID.not_link
        const node = MN.db.getNoteById(noteid)
        if (!node) throw lang.backup_ID.not_exit
        if (!node.childNotes?.length) throw lang.backup_ID.no_child
      }
    }
  ]
})

if (!MN.isMN4) {
  config.settings = config.settings.filter(k => k.key !== "useMarkdown")
}

export default config
