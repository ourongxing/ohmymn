import { lang } from "./lang"
import { CellViewType } from "@/typings/enum"
import { defineConfig } from "@/utils"
import { showHUD } from "@/utils/common"
import { makeObsidianOutline } from "./utils"
import { MN } from "@/const"
const { link, intro, lable, option, help } = lang

export default defineConfig({
  name: "Export Outline",
  key: "exportoutline",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key: "contentMethod",
      option: [
        "导出包含其所有子节点",
        "导出包含其所有父节点",
        "导出包含其所有父子节点"
      ],
      label: "导出内容"
    },
    {
      type: CellViewType.Select,
      key: "imgprocess",
      option: ["导出图片", "转为文字"],
      label: "图片处理方式"
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.InlineInput,
      key: "imgsize",
      label: "图片大小",
      help: "单位：px",
      bind: [["imgprocess", 0]]
    },
    {
      type: CellViewType.Input,
      key: "vault",
      help: "保险库名"
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Input,
      key: "fileName",
      help: "要创建的文件名"
      // bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Select,
      key: "writeMethod",
      option: ["无", "追加", "覆盖"],
      label: "写入方式"
      // bind: [["exportMethod", 0]]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportOutline2app",
      label: "导出大纲",
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
          } else showHUD("没有选择任何一张卡片")
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
          } else showHUD("没有选择任何一张卡片")
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
          } else showHUD("没有选择任何一张卡片")
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
