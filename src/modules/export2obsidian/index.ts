import { lang } from "./lang"
import { CellViewType } from "@/typings/enum"
import { defineConfig } from "@/profile"
import { openUrl, showHUD } from "@/utils/common"
import { makeObsidianOutline } from "./utils"
import { MN } from "@/const"
const { link, intro, lable, option, help, hud } = lang

export default defineConfig({
  name: "Export to Obsidian",
  key: "export2obsidian",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key: "contentMethod",
      option: option.content_method,
      label: lable.content_method
    },
    {
      type: CellViewType.Select,
      key: "imgprocess",
      option: option.img_process,
      label: lable.img_process
    },
    {
      type: CellViewType.InlineInput,
      key: "imgsize",
      label: lable.img_size,
      help: help.img_size,
      bind: ["imgprocess", 0]
    },
    {
      type: CellViewType.Input,
      key: "vault",
      help: help.vault
    },
    {
      type: CellViewType.Input,
      key: "fileName",
      help: help.file_name
    },
    {
      type: CellViewType.Select,
      key: "writeMethod",
      option: option.write_method,
      label: lable.write_method
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2obsidian",
      label: "导出到 Obsidian",
      method: async ({ nodes, option }) => {
        let allText = ""
        for (const node of nodes) {
          const exportText = makeObsidianOutline(
            node,
            self.globalProfile.export2obsidian.contentMethod[0],
            self.globalProfile.export2obsidian.imgprocess[0],
            `pic.png|${self.globalProfile.export2obsidian.imgsize}`
          )
          allText += exportText + "\n"
        }
        if (self.globalProfile.export2obsidian.writeMethod[0] == 0) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.export2obsidian.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.export2obsidian.fileName) +
              "&content=" +
              encodeURIComponent(allText)
            MN.app.openURL(NSURL.URLWithString(obsURL))
          } else showHUD(hud.actions_card)
        } else if (self.globalProfile.export2obsidian.writeMethod[0] == 1) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.export2obsidian.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.export2obsidian.fileName) +
              "&content=" +
              encodeURIComponent(allText) +
              "&append"
            openUrl(obsURL)
          } else showHUD(hud.actions_card)
        } else if (self.globalProfile.export2obsidian.writeMethod[0] == 2) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.export2obsidian.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.export2obsidian.fileName) +
              "&content=" +
              encodeURIComponent(allText) +
              "&overwrite"
            openUrl(obsURL)
          } else showHUD(hud.actions_card)
        }
      }
    }
  ]
})
