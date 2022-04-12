import { Addon } from "@/const"
import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IConfig, MbBookNote } from "@/typings"
import { CellViewType, UIAlertViewStyle } from "@/typings/enum"
import { escapeURLParam } from "@/utils"
import { showHUD, openUrl } from "@/utils/common"
import { reverseEscape } from "@/utils/input"
import fetch from "@/utils/network"
import { removeHighlight } from "@/utils/note"
import popup from "@/utils/popup"
import { lang } from "./lang"
import { ExportMethod, AddTags } from "./typings"

const { link, intro, lable, option, help } = lang

const configs: IConfig<"export2flomo"> = {
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
      bind: [["exportMethod", 1]]
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
      bind: [["addTags", 2]]
    },
    {
      type: CellViewType.Select,
      key: "defaultTemplate",
      label: "默认导出模版",
      option: ["模版 1", "模版 2", "模版 3"],
      help: "【仅当前文档有效】"
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
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "flomoTemplate2",
      help: "模版 2",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "flomoTemplate3",
      help: "模版 3",
      bind: [["showTemplate", 1]]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2Flomo",
      label: "导出到 Flomo",
      option: ["默认", "模板 1", "模版 2", "模版 3"],
      method: async ({ nodes, option }) => {
        const { exportMethod } = self.profile.export2flomo
        const { defaultTemplate } = self.docProfile.export2flomo
        option = option === 0 ? defaultTemplate[0] : option - 1
        if (exportMethod[0] === ExportMethod.URL) {
          if (nodes.length > 1) {
            showHUD("请注意，URL Scheme 单次只能导出一张卡片的内容！")
          }
          const c = utils.getContent(nodes[0], option)
          if (c) openUrl("flomo://create?content=" + escapeURLParam(c))
          else showHUD("模版对应的内容为空")
        } else
          try {
            for (const node of nodes) {
              const c = utils.getContent(node, option)
              if (c) await utils.exportByAPI(c)
              else showHUD("模版对应的内容为空")
            }
            showHUD("导出成功")
          } catch (err) {
            console.error(String(err))
            showHUD(String(err))
          }
      }
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "exportText2Flomo",
      label: "导出到 Flomo",
      method: async ({ text }) => {
        const { exportMethod } = self.profile.export2flomo
        if (exportMethod[0] === ExportMethod.URL) {
          openUrl("flomo://create?content=" + escapeURLParam(text))
        } else {
          try {
            await utils.exportByAPI(text)
            showHUD("导出成功")
          } catch (err) {
            console.error(String(err))
            showHUD(String(err))
          }
        }
      }
    }
  ]
}

const utils = {
  async selectPartOfParts(parts: string[], message = "选择你想要的") {
    const { option } = await popup(
      {
        title: Addon.title,
        message,
        type: UIAlertViewStyle.Default,
        buttons: parts,
        canCancel: false,
        multiLine: true
      },
      ({ buttonIndex }) => ({
        option: buttonIndex
      })
    )
    return parts[option]
  },
  getContent(node: MbBookNote, option: number) {
    const {
      flomoTemplate1,
      flomoTemplate2,
      flomoTemplate3,
      tagTemplate,
      addTags
    } = self.profile.export2flomo
    const list = [flomoTemplate1, flomoTemplate2, flomoTemplate3].reduce(
      (acc, cur) => {
        if (cur) {
          const tags = (() => {
            if (addTags[0] === AddTags.CardTags) {
              return renderTemplateOfNodeProperties(
                node,
                "{{#tags}}#{{.}} {{/tags}}"
              )
            } else if (addTags[0] === AddTags.Custom && tagTemplate) {
              return renderTemplateOfNodeProperties(
                node,
                reverseEscape(tagTemplate, true)
              )
            }
          })()
          const main = renderTemplateOfNodeProperties(
            node,
            reverseEscape(cur, true)
          )
          const c = removeHighlight(main + "\n" + (tags ?? "")).trim()
          if (c) acc.push(c)
        }
        return acc
      },
      [] as string[]
    )
    return list[option]
  },
  async exportByAPI(content: string) {
    const { flomoAPI } = self.profile.export2flomo
    const res = (await fetch(flomoAPI, {
      method: "POST",
      json: {
        content
      }
    }).then(res => res.json())) as {
      message: string
      code: number
    }
    if (res.code !== 0) throw res.message
  }
}

export default { configs, utils }
