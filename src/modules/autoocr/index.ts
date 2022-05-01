import { Addon } from "@/const"
import { CellViewType, UIAlertViewStyle } from "@/typings/enum"
import { showHUD, openUrl, copy } from "@/utils/common"
import { defineConfig } from "@/utils"
import popup from "@/utils/popup"
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
      label: label.formulaOCRProviders
    },
    {
      key: "markdown",
      type: CellViewType.Select,
      option: ["Markdown", "myMarkDown"],
      label: "使用的 Markdown 插件"
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
      bind: ["showKey", 1]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: help.baiduSecretKey,
      bind: ["showKey", 1]
    },
    {
      key: "mathpixAppKey",
      type: CellViewType.Input,
      help: help.mathpixAppKey,
      bind: [
        ["showKey", 1],
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
          const res =
            self.globalProfile.autoocr.formulaOCRProviders[0] === 0
              ? await baiduFormulaOCR(imgBase64)
              : await mathpixOCR(imgBase64)
          return [res, `$${res}$`, `$$${res}$$`][option]
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
