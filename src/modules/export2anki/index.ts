import { lang } from "./lang"
import type { IConfig, ICheckMethod, ISettingInput, MbBookNote } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"
import { AddTags, AnkiNote, ExportMethod } from "./typings"
import { openUrl, showHUD } from "utils/common"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"
import { reverseEscape } from "utils/input"
import { AnkiConnect } from "./ankiconnect"
import { MN } from "const"
const { link, intro, lable, option, help } = lang

const checker: Record<"field" | "modelName", ICheckMethod> = {
  async field({ input }) {
    const { ankiConnectAPI, exportMethod, showTemplate } =
      self.profile.export2anki
    console.log(ankiConnectAPI)
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
      if (modelName) {
        const res = await anki.getModelFieldNames(modelName)
        if (!res.result?.includes(key))
          throw `输入错误，模版 ${modelName} 中没有此字段`
      }
    }
  },
  async modelName({ input }) {
    const { ankiConnectAPI, exportMethod } = self.profile.export2anki
    if (exportMethod[0] === ExportMethod.API && ankiConnectAPI) {
      const anki = new AnkiConnect(ankiConnectAPI)
      const res = await anki.getModelList()
      if (!res.result?.includes(input)) throw `输入错误，Anki 中没有此模板`
    }
  }
}

const configs: IConfig<"export2anki"> = {
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
      bind: [["exportMethod", 1]],
      async check({ input }) {
        const anki = new AnkiConnect(input)
        await anki.getModelList()
      }
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
      type: CellViewType.Switch,
      key: "jumpBack",
      label: "导出后跳转回 MN ",
      bind: [["exportMethod", 0]]
    },
    {
      type: CellViewType.Switch,
      key: "allowRepeat",
      label: "允许重复",
      bind: [["exportMethod", 0]]
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
                bind: [["showTemplate", i + 1]],
                check: checker.modelName
              }
            : {
                type: CellViewType.Input,
                key: `field${i + 1}${j}`,
                help: `字段 ${j}${
                  j === 1
                    ? "。第一个字段会用来判断卡片是否存在，点击查看输入格式"
                    : ""
                }`,
                bind: [["showTemplate", i + 1]],
                check: checker.field
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
      async method({ nodes, option }) {
        try {
          const { exportMethod, ankiConnectAPI, autoSync } =
            self.profile.export2anki
          const { defaultTemplate } = self.docProfile.export2anki
          option = option === 0 ? defaultTemplate[0] : option - 1
          if (exportMethod[0] === ExportMethod.URL) {
            nodes.length > 1 &&
              showHUD("请注意，URL Scheme 单次只能导出一张卡片的内容！")
            const url = utils.genUrlScheme(
              utils.genAnkiNote(nodes[0], option),
              nodes[0].noteId!
            )
            console.log(url)
            openUrl(url)
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
  },
  genUrlScheme(note: AnkiNote, id: string) {
    const { profileName, allowRepeat, jumpBack } = self.profile.export2anki
    const { modelName, deckName, fields, tags } = note
    const ankiUrl = "anki://x-callback-url/addnote?"
    const fieldsText = Object.entries(fields).reduce((acc, cur) => {
      const [key, value] = cur
      return `${acc}${acc ? "&" : ""}fld${key}=${value}`
    }, "")
    return `${ankiUrl}profile=${profileName}&type=${modelName}&deck=${deckName}&${fieldsText}${
      tags.length ? "&tags=" + tags.join("%20") : ""
    }${allowRepeat ? "&dupes=1" : ""}${
      jumpBack ? "&x-success=marginnote3app://note/" + id : ""
    }`
  }
}

export default { configs, utils }
