import { CellViewType } from "~/typings/enum"
import { openUrl, showHUD } from "~/utils/common"
import { lang } from "./lang"
import { getContent } from "./utils"
import { defineConfig } from "~/profile"
const { link, intro, lable, option, help, hud } = lang

export default defineConfig({
  name: "Export to Devonthink",
  key: "export2devonthink",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key: "exportMethod",
      option: ["PDF", "HTML", "Markdown", "Text"],
      label: lable.export_method
    },
    {
      type: CellViewType.Switch,
      key: "showTemplate",
      label: lable.show_template
    },
    {
      type: CellViewType.Input,
      key: "title",
      help: help.title,
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "comment",
      help: help.comment,
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Select,
      key: "addTags",
      label: lable.add_tags,
      help: "固定添加在最后",
      option: option.add_tags
    },
    {
      type: CellViewType.Switch,
      key: "hide",
      label: help.hide,
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "tags",
      help: help.tags,
      bind: ["addTags", 2]
    },
    {
      type: CellViewType.Input,
      key: "destination",
      help: help.destination,
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "htmlsource",
      help: help.html_source,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 1]
      ]
    },
    {
      type: CellViewType.Input,
      key: "pdfsource",
      help: help.pdf_source,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Input,
      key: "mdtext",
      help: help.md_text,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 2]
      ]
    },
    {
      type: CellViewType.Input,
      key: "txtext",
      help: help.tx_text,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 3]
      ]
    },
    {
      type: CellViewType.Input,
      key: "referrer",
      help: help.referrer,
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "width",
      help: help.width,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Switch,
      key: "paginated",
      label: help.paginated,
      bind: [
        ["showTemplate", true],
        ["exportMethod", 0]
      ]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2devonthink",
      label: lable.actions_card,
      method: async ({ nodes, option }) => {
        for (const node of nodes) {
          const c = await getContent(node, option)
          console.log(c, "export2devonthink")
          if (c) {
            openUrl(c)
            console.log("success", "researchtool")
          } else showHUD(hud.actions_card)
        }
      }
    }
  ]
})
