import { lang } from "./lang"
import type { IConfig, ICheckMethod, ISettingInput, MbBookNote } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"
import { ActionKey, AddTags, AnkiNote, AutoSync, ExportMethod } from "./typings"
import { showHUD } from "utils/common"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"
import { reverseEscape } from "utils/input"
import { AnkiConnect } from "./ankiconnect"
import { MN } from "const"
const { link, intro, lable, option, help } = lang

const configs: IConfig<
  (IProfile & IDocProfile)["export2anki"],
  typeof ActionKey
> = {
  name: "Export to Anki",
  key: "export2anki",
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
      key: "ankiConnectAPI",
      help: "Anki Connect API，需要电脑端安装 Anki Connect。点击查看获取方法。",
      bind: [["exportMethod", 1]]
    },
    {
      type: CellViewType.Select,
      key: "autoSync",
      label: "导出后自动同步",
      option: ["无", "仅iPad导出时", "都同步"],
      help: "桌面端自动上传到 Anki Web，iPad 可手动同步过来。",
      bind: [["exportMethod", 1]]
    },
    {
      type: CellViewType.Select,
      key: "addTags",
      label: "添加标签",
      option: ["无", "仅卡片中的标签", "自定义标签模板"]
    },
    {
      type: CellViewType.Input,
      key: "tagTemplate",
      help: "标签模版，点击查看支持的变量。",
      bind: [["addTags", 2]]
    },
    {
      type: CellViewType.InlineInput,
      key: "profileName",
      label: "Anki 配置名"
    },
    {
      type: CellViewType.Input,
      key: "deckName",
      help: "【仅当前文档有效】Anki 牌组名"
    },
    {
      type: CellViewType.Select,
      key: "defaultTemplate",
      label: "默认导出模版",
      option: ["模版 1", "模版 2", "模版 3"],
      help: "【仅当前文档有效】"
    },
    {
      type: CellViewType.Select,
      key: "showTemplate",
      label: "显示/隐藏模板",
      option: ["全部隐藏", "模版 1", "模版 2", "模版 3"]
    },
    ...(Array.from(Array(3).fill(0), () => new Array(10).fill(0))
      .map((k, i) =>
        k.map((_, j) => {
          return j === 0
            ? {
                type: CellViewType.InlineInput,
                key: `modelName${i + 1}`,
                label: `Anki 模版名`,
                bind: [["showTemplate", i + 1]]
              }
            : {
                type: CellViewType.Input,
                key: `field${i + 1}${j}`,
                help: `字段 ${j}${j === 1 ? "，点击查看输入格式" : ""}`,
                bind: [["showTemplate", i + 1]]
              }
        })
      )
      .flat() as ISettingInput<(IProfile & IDocProfile)["export2anki"]>[])
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2Anki",
      label: "导出到 Anki",
      option: ["默认", "模板 1", "模版 2", "模版 3"],
      method: async ({ nodes, option }) => {
        try {
          const { exportMethod, ankiConnectAPI, autoSync } =
            self.profile.export2anki
          const { defaultTemplate } = self.docProfile.export2anki
          option = option === 0 ? defaultTemplate[0] : option - 1
          if (exportMethod[0] === ExportMethod.URL) {
            if (nodes.length > 1) {
              showHUD("请注意，URL Scheme 单次只能导出一张卡片的内容！")
            }
          } else {
            if (!ankiConnectAPI) throw "请输入 Anki Connect API"
            const anki = new AnkiConnect(ankiConnectAPI)
            const res = await anki.addNotes(
              nodes.map(k => utils.genAnkiNote(k, option)),
              [false, !MN.isMac, true][autoSync[0]]
            )
            if (res.result.every(k => k)) showHUD("全部导出成功")
            else throw res.error
          }
        } catch (err) {
          showHUD(err ? String(err) : "导出失败", 3)
        }
      }
    }
  ]
}

const utils = {
  genAnkiNote(node: MbBookNote, option: number): AnkiNote {
    const { tagTemplate, addTags } = self.profile.export2anki
    const tags = (
      (() => {
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
      })() ?? ""
    )
      .split(/\s*?#\s*?/)
      .filter(k => k)

    let { deckName } = self.docProfile.export2anki
    if (!deckName) throw "请输入牌组名"
    else deckName = renderTemplateOfNodeProperties(node, deckName)
    const { modelName, fields } = Object.entries(
      self.profile.export2anki
    ).reduce(
      (acc, cur) => {
        const [key, value] = cur
        if (typeof value !== "string") return acc
        if (key.includes(`modelName${option + 1}`)) {
          acc.modelName = value
        } else if (key.includes(`field${option + 1}`)) {
          const [k, v] = value.split(/\s*——\s*/)
          if (k)
            acc.fields[k] = renderTemplateOfNodeProperties(
              node,
              reverseEscape(v, true) ?? ""
            )
        }
        return acc
      },
      {
        modelName: "",
        fields: {} as Record<string, string>
      }
    )
    return {
      tags,
      deckName,
      fields,
      modelName
    }
  }
}

const checker: ICheckMethod<
  PickByValue<IProfile["export2anki"], string>
> = async (input, key) => {
  const { ankiConnectAPI, exportMethod, showTemplate } =
    self.profile.export2anki
  if (key.startsWith("field")) {
    if (!input.includes("——")) throw "请务必用 —— 来隔开字段名及其内容"
    const [key, value] = input.split(/\s*——\s*/)
    if (!key) throw "没有输入字段名"
    if (
      showTemplate[0] &&
      ankiConnectAPI &&
      exportMethod[0] === ExportMethod.API
    ) {
      const modelName = self.profile.export2anki["modelName" + showTemplate[0]]
      const anki = new AnkiConnect(ankiConnectAPI)
      if (!modelName) return true
      const res = await anki.getModelFieldNames(modelName)
      if (!res.result?.includes(key))
        throw `输入错误，模版 ${modelName} 中没有此字段`
    }
  } else if (key.startsWith("modelName")) {
    if (exportMethod[0] === ExportMethod.API && ankiConnectAPI) {
      const anki = new AnkiConnect(ankiConnectAPI)
      const res = await anki.getModelList()
      if (!res.result?.includes(input)) throw `输入错误，Anki 中没有此模板`
    }
  } else
    switch (key) {
      case "ankiConnectAPI":
        const anki = new AnkiConnect(input)
        await anki.getModelList()
        break
      default:
        return false
    }
}

const export2anki = { configs, utils, checker }
export default export2anki