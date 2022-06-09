import { CellViewType } from "@/typings/enum"
import { escapeURLParam } from "@/utils"
import { showHUD, openUrl } from "@/utils/common"
import { defineConfig } from "@/profile"
import { lang } from "./lang"
import { ExportMethod } from "./typings"
import { getContent, exportByAPI } from "./utils"

const { link, intro } = lang

export default defineConfig({
  name: "Export to Flomo",
  key: "export2flomo",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key: "exportMethod",
      option: ["URL Scheme", "API"],
      label: "导出方式"
    },
    {
      type: CellViewType.Input,
      key: "flomoAPI",
      help: "Flomo API，需要 Flomo Pro。点击获取 API。",
      bind: ["exportMethod", 1]
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
      key: "tagTemplate",
      help: "标签模版，点击查看支持的变量。",
      bind: ["addTags", 2]
    },
    {
      type: CellViewType.Select,
      key: "defaultTemplate",
      label: "默认导出模版",
      option: ["模版 1", "模版 2", "模版 3"],
      help: "【当前笔记本】"
    },
    {
      type: CellViewType.Switch,
      key: "showTemplate",
      label: "显示/隐藏所有模板"
    },
    {
      type: CellViewType.Input,
      key: "flomoTemplate1",
      help: "模版 1，点击查看支持的变量。",
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "flomoTemplate2",
      help: "模版 2",
      bind: ["showTemplate", true]
    },
    {
      type: CellViewType.Input,
      key: "flomoTemplate3",
      help: "模版 3",
      bind: ["showTemplate", true]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2Flomo",
      label: "导出到 Flomo",
      option: ["默认", "模板 1", "模版 2", "模版 3"],
      method: async ({ nodes, option }) => {
        const { exportMethod } = self.globalProfile.export2flomo
        const { defaultTemplate } = self.notebookProfile.export2flomo
        option = option === 0 ? defaultTemplate[0] : option - 1
        if (exportMethod[0] === ExportMethod.URL) {
          if (nodes.length > 1) {
            showHUD("请注意，URL Scheme 单次只能导出一张卡片的内容！")
          }
          const c = getContent(nodes[0], option)
          if (c) openUrl("flomo://create?content=" + escapeURLParam(c))
          else showHUD("模版对应的内容为空")
        } else
          try {
            for (const node of nodes) {
              const c = getContent(node, option)
              if (c) await exportByAPI(c)
              else showHUD("模版对应的内容为空")
            }
            showHUD("导出成功")
          } catch (err) {
            console.error(String(err))
            showHUD(String(err))
          }
      }
    }
  ]
})
