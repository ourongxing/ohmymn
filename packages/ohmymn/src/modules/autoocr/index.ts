import { CellViewType } from "~/typings"
import { HUDController, showHUD } from "marginnote"
import { defineConfig } from "~/profile"
import lang from "./lang"
import {
  baiduFormulaOCR,
  baiduHandWrittingOCR,
  doc2xOCR,
  mainOCR,
  mathpixOCR,
  QRCodeOCR,
  simpleTexOCR
} from "./utils"
import { doc } from "~/utils"

const config = defineConfig({
  name: "AutoOCR",
  key: "autoocr",
  intro: lang.intro,
  link: doc("autoocr"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on.label,
      help: lang.on.help,
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
      label: lang.lang.label,
      type: CellViewType.Select,
      option: lang.lang.$option21,
      help: lang.lang.help
    },
    {
      key: "formulaOCRProviders",
      type: CellViewType.Select,
      option: lang.formula_ocr_providers.$option2,
      label: lang.formula_ocr_providers.label,
      help: lang.formula_ocr_providers.help
    },
    {
      key: "markdown",
      type: CellViewType.Select,
      option: lang.markdown.$option3,
      label: lang.markdown.label,
      help: lang.markdown.help
    },
    {
      key: "simpleTexModel",
      type: CellViewType.Select,
      option: lang.simpletex_model.$option2,
      label: lang.simpletex_model.label,
      bind: ["formulaOCRProviders", 2]
    },
    {
      key: "showKey",
      type: CellViewType.Expland,
      label: lang.$show_key2
    },
    {
      key: "baiduApiKey",
      type: CellViewType.Input,
      help: lang.baidu_api_key.help,
      link: lang.baidu_api_key.link,
      bind: ["showKey", true]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: lang.baidu_secret_key.help,
      bind: ["showKey", true]
    },
    {
      key: "mathpixAppKey",
      type: CellViewType.Input,
      help: lang.mathpix_app_key.help,
      link: lang.mathpix_app_key.link,
      bind: [
        ["showKey", true],
        ["formulaOCRProviders", 1]
      ]
    },
    {
      key: "simpleTexApiKey",
      type: CellViewType.Input,
      help: lang.simpletex_api_key.help,
      link: lang.simpletex_api_key.link,
      bind: [
        ["showKey", true],
        ["formulaOCRProviders", 2]
      ]
    },
    {
      key: "doc2xApiKey",
      type: CellViewType.Input,
      help: lang.doc2x_api_key.help,
      link: lang.doc2x_api_key.link,
      bind: [
        ["showKey", true],
        ["formulaOCRProviders", 3]
      ]
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "formulaOCR",
      label: lang.formula_ocr.label,
      option: lang.formula_ocr.$option3,
      method: async ({ option, img, imgBase64 }) => {
        try {
          const fn = (function () {
            switch (self.globalProfile.autoocr.formulaOCRProviders[0]) {
              case 1:
                return mathpixOCR
              case 2:
                return simpleTexOCR
              case 3:
                return doc2xOCR
              default:
                return baiduFormulaOCR
            }
          })()
          HUDController.show("正在识别中...")
          let res = await fn(imgBase64, img)
          HUDController.hidden()
          if (res) {
            res = res.trim()
            return [res, `$${res}$`, `$$\n${res}\n$$`][option]
          }
        } catch (err) {
          HUDController.hidden()
          showHUD(String(err), 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "textOCR",
      label: lang.text_ocr,
      method: async ({ imgBase64 }) => {
        const res = await mainOCR(imgBase64)
        return res
      }
    },
    {
      type: CellViewType.Button,
      key: "handWrittingOCR",
      label: lang.hand_writting_ocr,
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
      label: lang.qr_code_ocr,
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

if (MN.isMN4) {
  config.settings = config.settings.filter(k => k.key !== "markdown")
}

export default config
