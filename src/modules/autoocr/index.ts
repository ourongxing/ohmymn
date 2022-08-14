import { CellViewType } from "~/typings/enum"
import { showHUD } from "~/utils/common"
import { defineConfig } from "~/profile"
import { lang } from "./lang"
import {
  baiduFormulaOCR,
  baiduHandWrittingOCR,
  mainOCR,
  mathpixOCR,
  QRCodeOCR
} from "./utils"

const { intro, link, label, option, help } = lang

export default defineConfig({
  name: "AutoOCR",
  key: "autoocr",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      help: help.on,
      auto: {
        customOCR: {
          index: 1,
          method({ imgBase64 }) {
            return mainOCR(imgBase64)
          }
        }
      }
    },
    {
      key: "lang",
      label: label.lang,
      type: CellViewType.Select,
      option: option.lang,
      help: help.lang
    },
    {
      key: "formulaOCRProviders",
      type: CellViewType.Select,
      option: option.formulaOCRProviders,
      label: label.formulaOCRProviders,
      help: "公式识别不支持摘录时自动识别，只能在 MagicAtion for Text 中手动进行公式识别。"
    },
    {
      key: "markdown",
      type: CellViewType.Select,
      option: ["Markdown", "myMarkDown", "Milkdown"],
      label: "使用的 Markdown 插件",
      help: "用于显示公式，推荐使用 Milkdown。"
    },
    {
      key: "showKey",
      type: CellViewType.Switch,
      label: label.showKey
    },
    {
      key: "baiduApiKey",
      type: CellViewType.Input,
      help: help.baiduApiKey,
      link: "https://ohmymn.vercel.app/guide/modules/autoocr.html#百度-ocr",
      bind: ["showKey", true]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: help.baiduSecretKey,
      bind: ["showKey", true]
    },
    {
      key: "mathpixAppKey",
      type: CellViewType.Input,
      help: help.mathpixAppKey,
      link: "https://ohmymn.vercel.app/guide/modules/autoocr.html#mathpix",
      bind: [
        ["showKey", true],
        ["formulaOCRProviders", 1]
      ]
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "formulaOCR",
      label: label.formulaOCR,
      option: option.formulaOCR,
      method: async ({ imgBase64, option }) => {
        try {
          const res = (
            self.globalProfile.autoocr.formulaOCRProviders[0] === 0
              ? await baiduFormulaOCR(imgBase64)
              : await mathpixOCR(imgBase64)
          ).trim()
          return [res, `$${res}$`, `$$\n${res}\n$$`][option]
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "textOCR",
      label: label.textOCR,
      method: async ({ imgBase64 }) => {
        const res = await mainOCR(imgBase64)
        return res
      }
    },
    {
      type: CellViewType.Button,
      key: "handWrittingOCR",
      label: label.handWrittingOCR,
      method: async ({ imgBase64 }) => {
        try {
          return await baiduHandWrittingOCR(imgBase64)
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "QRCodeOCR",
      label: label.QRCodeOCR,
      method: async ({ imgBase64 }) => {
        try {
          return await QRCodeOCR(imgBase64)
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
})
