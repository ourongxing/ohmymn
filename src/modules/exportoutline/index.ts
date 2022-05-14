import { lang } from "./lang"
import { CellViewType } from "@/typings/enum"
import { defineConfig } from "@/utils"
import { showHUD } from "@/utils/common"
import { makeObsidianOutline } from "./utils"
import { MN } from "@/const"
const { link, intro, lable, option, help, hud } = lang

export default defineConfig({
  name: "Export Outline",
  key: "exportoutline",
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
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.InlineInput,
      key: "imgsize",
      label: lable.img_size,
      help: help.img_size,
      bind: [["imgprocess", 0]]
    },
    {
      type: CellViewType.Input,
      key: "vault",
      help: help.vault
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Input,
      key: "fileName",
      help: help.file_name
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Select,
      key: "writeMethod",
      option: option.write_method,
      label: lable.write_method
      // bind: [["exportMethod", 0]]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportOutline2app",
      label: lable.actions_card,
      method: async ({ nodes, option }) => {
        let allText = ""
        for (const node of nodes) {
          const exportText = makeObsidianOutline(
            node,
            self.globalProfile.exportoutline.contentMethod[0],
            self.globalProfile.exportoutline.imgprocess[0],
            `pic.png|${self.globalProfile.exportoutline.imgsize}`
          )
          allText += exportText + "\n"
        }
        // console.log("success","export2devonthink")
        // console.log(allText,"export2devonthink")
        if (self.globalProfile.exportoutline.writeMethod[0] == 0) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.exportoutline.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.exportoutline.fileName) +
              "&content=" +
              encodeURIComponent(allText)
            MN.app.openURL(NSURL.URLWithString(obsURL))
          } else showHUD(hud.actions_card)
        } else if (self.globalProfile.exportoutline.writeMethod[0] == 1) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.exportoutline.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.exportoutline.fileName) +
              "&content=" +
              encodeURIComponent(allText) +
              "&append"
            MN.app.openURL(NSURL.URLWithString(obsURL))
          } else showHUD(hud.actions_card)
        } else if (self.globalProfile.exportoutline.writeMethod[0] == 2) {
          if (allText) {
            const obsURL =
              "obsidian://new?vault=" +
              encodeURIComponent(self.globalProfile.exportoutline.vault) +
              "&name=" +
              encodeURIComponent(self.globalProfile.exportoutline.fileName) +
              "&content=" +
              encodeURIComponent(allText) +
              "&overwrite"
            MN.app.openURL(NSURL.URLWithString(obsURL))
          } else showHUD(hud.actions_card)
        }
      }
    }
  ],
  actions4text: [
    // {
    //   type: CellViewType.Button,
    //   key: "action4Text",
    //   label: "",
    //   option: [],
    //   method: ({ text, option }) => {
    //     console.log("")
    //   }
    // }
  ]
})
