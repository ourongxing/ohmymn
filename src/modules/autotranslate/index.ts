import { CellViewType } from "@/typings/enum"
import { checkPositiveinteger } from "@/utils/checkInput"
import { copy, showHUD } from "@/utils/common"
import { defineConfig } from "@/utils"
import { lang } from "./lang"
import { TranslateProviders } from "./typings"
import { baiduTranslate, caiyunTranslate, translateText } from "./utils"

const { link, label } = lang

export default defineConfig({
  name: "AutoTranslate",
  key: "autotranslate",
  intro: "摘录时自动附加上翻译结果",
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateComments: {
          index: -1,
          method({ text }) {
            return translateText(text)
          }
        }
      }
    },
    {
      key: "wordCount",
      type: CellViewType.Input,
      help: "[类中文字数，类英文单词数]，超过才会翻译。"
    },
    {
      key: "translateProviders",
      type: CellViewType.Select,
      option: ["百度翻译", "彩云小译"],
      label: "翻译提供商"
    },
    {
      key: "caiyunFromLang",
      label: "输入语言",
      type: CellViewType.Select,
      option: ["自动检测", "中文", "英文", "日文"],
      bind: ["translateProviders", 1]
    },
    {
      key: "caiyunToLang",
      label: "输出语言",
      type: CellViewType.Select,
      option: ["中文", "英文", "日文"],
      bind: ["translateProviders", 1]
    },
    {
      key: "baiduFromLang",
      label: "输入语言",
      type: CellViewType.Select,
      option: [
        "自动检测",
        "中文",
        "英语",
        "粤语",
        "文言文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "泰语",
        "阿拉伯语",
        "俄语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "希腊语",
        "荷兰语",
        "波兰语",
        "保加利亚语",
        "爱沙尼亚语",
        "丹麦语",
        "芬兰语",
        "捷克语",
        "罗马尼亚语",
        "斯洛文尼亚语",
        "瑞典语",
        "匈牙利语",
        "繁体中文",
        "越南语"
      ],
      bind: ["translateProviders", 0]
    },
    {
      key: "baiduToLang",
      label: "输出语言",
      type: CellViewType.Select,
      option: [
        "中文",
        "英语",
        "粤语",
        "文言文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "泰语",
        "阿拉伯语",
        "俄语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "希腊语",
        "荷兰语",
        "波兰语",
        "保加利亚语",
        "爱沙尼亚语",
        "丹麦语",
        "芬兰语",
        "捷克语",
        "罗马尼亚语",
        "斯洛文尼亚语",
        "瑞典语",
        "匈牙利语",
        "繁体中文",
        "越南语"
      ],
      bind: ["translateProviders", 0]
    },
    {
      key: "baiduThesaurus",
      type: CellViewType.Switch,
      label: "自定义术语库",
      help: "百度翻译高级版可用，仅支持中英互译，点击新建自定义术语。",
      link: "https://fanyi-api.baidu.com/manage/term",
      bind: ["translateProviders", 0]
    },
    {
      key: "autoCopy",
      type: CellViewType.Switch,
      label: "翻译后自动复制",
      help: "【Action】"
    },
    {
      key: "hudTime",
      type: CellViewType.InlineInput,
      label: "翻译弹窗显示时间",
      help: "【Action】",
      check({ input }) {
        checkPositiveinteger(Number(input))
      }
    },
    {
      key: "showKey",
      type: CellViewType.Switch,
      label: "显示/隐藏 Key"
    },
    {
      key: "baiduAppID",
      type: CellViewType.Input,
      help: "百度 App ID，点击查看如何获取。",
      bind: [
        ["showKey", 1],
        ["translateProviders", 0]
      ]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: "百度密钥",
      bind: [
        ["showKey", 1],
        ["translateProviders", 0]
      ]
    },
    {
      key: "caiyunToken",
      type: CellViewType.Input,
      help: "彩云小译 Token，点击查看如何获取。",
      bind: [
        ["showKey", 1],
        ["translateProviders", 1]
      ]
    }
  ],
  actions4text: [
    {
      key: "translateText",
      type: CellViewType.Button,
      label: "翻译所选文字",
      method: async ({ text }) => {
        try {
          const {
            autoCopy,
            hudTime,
            translateProviders,
            baiduFromLang,
            baiduToLang,
            caiyunFromLang,
            caiyunToLang
          } = self.globalProfile.autotranslate
          const translation =
            translateProviders[0] === TranslateProviders.Baidu
              ? await baiduTranslate(text, baiduFromLang[0], baiduToLang[0])
              : await caiyunTranslate(text, caiyunFromLang[0], caiyunToLang[0])
          if (autoCopy) copy(translation, false)
          showHUD(translation, Number(hudTime))
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
})
