import { MN } from "@/const"
import { IGlobalProfile, IDocProfile } from "@/profile"
import { ISettingInput } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { showHUD, openUrl, defineConfig } from "@/utils/common"
import { lang } from "./lang"
import { ExportMethod } from "./typings"
import { AnkiConnect, checker, genAnkiNote, genUrlScheme } from "./utils"

const { link, intro, lable, option, help } = lang

export default defineConfig<"export2anki">({
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
      bind: ["exportMethod", 1],
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
      bind: ["exportMethod", 1]
    },
    {
      type: CellViewType.Switch,
      key: "jumpBack",
      label: "导出后跳转回 MN ",
      bind: ["exportMethod", 0]
    },
    {
      type: CellViewType.Switch,
      key: "allowRepeat",
      label: "允许重复",
      bind: ["exportMethod", 0]
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
      bind: ["addTags", 2]
    },
    {
      type: CellViewType.InlineInput,
      key: "profileName",
      label: "Anki 配置名"
    },
    {
      type: CellViewType.Input,
      key: "deckName",
      help: "【当前笔记本】Anki 牌组名"
    },
    {
      type: CellViewType.Select,
      key: "defaultTemplate",
      label: "默认导出模版",
      option: ["模版 1", "模版 2", "模版 3"],
      help: "【当前笔记本】"
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
                bind: ["showTemplate", i + 1],
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
                bind: ["showTemplate", i + 1],
                check: checker.field
              }
        })
      )
      .flat() as ISettingInput<(IGlobalProfile & IDocProfile)["export2anki"]>[])
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
            self.globalProfile.export2anki
          const { defaultTemplate } = self.notebookProfile.export2anki
          option = option === 0 ? defaultTemplate[0] : option - 1
          if (exportMethod[0] === ExportMethod.URL) {
            nodes.length > 1 &&
              showHUD("请注意，URL Scheme 单次只能导出一张卡片的内容！")
            const url = genUrlScheme(
              genAnkiNote(nodes[0], option),
              nodes[0].noteId!
            )
            console.log(url)
            openUrl(url)
          } else {
            if (!ankiConnectAPI) throw "请输入 Anki Connect API"
            const anki = new AnkiConnect(ankiConnectAPI)
            const res = await anki.addNotes(
              nodes.map(k => genAnkiNote(k, option)),
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
})
