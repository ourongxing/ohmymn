import { CellViewType } from "@/typings/enum"
import { openUrl, showHUD } from "@/utils/common"
import { lang } from "./lang"
import { getContent } from "./utils"
import { defineConfig } from "@/utils"
const { link, intro, lable, option, help } = lang

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
      label: "下载or导出"
    },
    {
      type: CellViewType.Switch,
      key: "showTemplate",
      label: "显示/隐藏所有模板"
    },
    {
      type: CellViewType.Input,
      key: "title",
      help: "标题",
      bind: ["showTemplate", 1]
    },
    {
      type: CellViewType.Input,
      key: "comment",
      help: "评论",
      bind: ["showTemplate", 1]
    },
    {
      type: CellViewType.Select,
      key: "addTags",
      label: "添加标签",
      help: "固定添加在最后",
      option: ["无", "仅卡片中的标签", "自定义标签模板"]
    },
    {
      type: CellViewType.Input,
      key: "tags",
      help: "标签模版，点击查看支持的变量。",
      bind: ["addTags", 2]
    },
    {
      type: CellViewType.Input,
      key: "destination",
      help: "目标文件夹(输入对应文件夹UUID)",
      bind: ["showTemplate", 1]
    },
    {
      type: CellViewType.Input,
      key: "htmlsource",
      help: "URL用于下载为HTML文件(请务必加上http或者https)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 1]
      ]
    },
    {
      type: CellViewType.Input,
      key: "pdfsource",
      help: "URL用于下载为PDF文件(请务必加上http或者https)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Input,
      key: "mdtext",
      help: "正文文本",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 2]
      ]
    },
    {
      type: CellViewType.Input,
      key: "txtext",
      help: "正文文本",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 3]
      ]
    },
    {
      type: CellViewType.Input,
      key: "hide",
      help: "隐藏(1/0)",
      bind: ["showTemplate", 1]
    },
    {
      type: CellViewType.Input,
      key: "referrer",
      help: "URL链接(用于引用)",
      bind: ["showTemplate", 1]
    },
    {
      type: CellViewType.Input,
      key: "width",
      help: "宽度",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Input,
      key: "paginated",
      help: "分页(1/0)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2app",
      label: "导出到Devonthink",
      method: async ({ nodes, option }) => {
        for (const node of nodes) {
          const c = await getContent(node, option)
          console.log(c, "export2devonthink")
          if (c) {
            openUrl(c)
            console.log("success", "researchtool")
          } else showHUD("模版对应的内容为空")
        }
      }
    }
  ]
})
