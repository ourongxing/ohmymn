import type { IConfig } from "typings"
import { CellViewType, UIAlertViewStyle } from "typings/enum"
import { lang } from "./lang"
import { Addon } from "const"
import fetch from "utils/network"
import { openUrl, showHUD } from "utils/common"
import { BaiduOCRError } from "./typings"
import popup from "utils/popup"
const { intro, link, label, option, help, other } = lang

const configs: IConfig<"autoocr"> = {
  name: "AutoOCR",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      help: help.on
    },
    {
      key: "lang",
      label: label.lang,
      type: CellViewType.Select,
      option: option.lang
    },
    {
      key: "formulaOCRProviders",
      type: CellViewType.Select,
      option: option.formulaOCRProviders,
      label: label.formulaOCRProviders
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
      bind: [["showKey", 1]]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: help.baiduSecretKey,
      bind: [["showKey", 1]]
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
            self.profile.autoocr.formulaOCRProviders[0] === 0
              ? await utils.baiduFormulaOCR(imgBase64)
              : await utils.mathpixOCR(imgBase64)
          utils.copy([res, `$${res}$`, `$$${res}$$`][option])
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
        const res = await utils.main(imgBase64)
        res && utils.copy(res)
      }
    },
    {
      type: CellViewType.Button,
      key: "handWrittingOCR",
      label: label.handWrittingOCR,
      method: async ({ imgBase64 }) => {
        try {
          const res = await utils.baiduHandWrittingOCR(imgBase64)
          utils.copy(res)
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
          const res = await utils.QRCodeOCR(imgBase64)
          const url = res.match(
            /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
          )
          if (url?.[0]) {
            const { option } = await popup(
              {
                title: Addon.title,
                message: other.link,
                type: UIAlertViewStyle.Default,
                buttons: [other.sure]
              },
              ({ buttonIndex }) => ({
                option: buttonIndex
              })
            )
            option !== -1 && openUrl(url[0])
          } else {
            utils.copy(res)
          }
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
}

const utils = {
  async getBaiduToken() {
    const { lastGetToken, baiduToken } = self.profile.additional.autoocr
    const { baiduApiKey, baiduSecretKey } = self.profile.autoocr
    if (baiduToken && Date.now() - lastGetToken < 2592000000) return baiduToken
    const res = (await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${baiduApiKey}&client_secret=${baiduSecretKey}`
    ).then(res => res.json())) as { access_token: string }
    if (!res.access_token) throw other.baidu_token_error
    self.profile.additional.autoocr = {
      lastGetToken: Date.now(),
      baiduToken: res.access_token
    }
    return res.access_token
  },
  async mathpixOCR(imgBase64: string) {
    const { mathpixAppKey } = self.profile.autoocr
    if (!mathpixAppKey) throw other.no_mathpix_key
    const res = (await fetch("https://api.mathpix.com/v3/latex", {
      method: "POST",
      headers: {
        app_key: mathpixAppKey
      },
      json: {
        src: "data:image/jpg;base64," + imgBase64,
        formats: ["latex_styled"],
        ocr: ["math", "text"]
      }
    }).then(res => res.json())) as {
      latex_styled: string
    }
    if (!res.latex_styled) throw other.mathpix_key_error
    return res.latex_styled
  },
  async QRCodeOCR(imgBase64: string) {
    const token = await utils.getBaiduToken()
    const res = (await fetch(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/qrcode?access_token=${token}}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          image: imgBase64
        }
      }
    ).then(res => res.json())) as {
      codes_result: { text: string }[]
    } & BaiduOCRError
    if (res.error_code && res.error_msg)
      throw `${res.error_code}: ${res.error_msg}`
    return res.codes_result.map(k => k.text).join("")
  },
  async baiduFormulaOCR(imgBase64: string) {
    const token = await utils.getBaiduToken()
    const res = (await fetch(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/formula?access_token=${token}}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          image: imgBase64
        }
      }
    ).then(res => res.json())) as {
      words_result: { words: string }[]
    } & BaiduOCRError
    if (res.error_code && res.error_msg)
      throw `${res.error_code}: ${res.error_msg}`
    return res.words_result.map(k => k.words).join("")
  },
  async baiduHandWrittingOCR(imgBase64: string) {
    const token = await utils.getBaiduToken()
    const res = (await fetch(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token=${token}}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          image: imgBase64
        }
      }
    ).then(res => res.json())) as {
      words_result: { words: string }[]
    } & BaiduOCRError
    if (res.error_code && res.error_msg)
      throw `${res.error_code}: ${res.error_msg}`
    return res.words_result.map(k => k.words).join("")
  },
  async main(imgBase64: string) {
    try {
      const langKey = [
        "auto_detect",
        "CHN_ENG",
        "ENG",
        "JAP",
        "KOR",
        "FRE",
        "SPA",
        "POR",
        "GER",
        "ITA",
        "RUS",
        "DAN",
        "DUT",
        "MAL",
        "SWE",
        "IND",
        "POL",
        "ROM",
        "TUR",
        "GRE",
        "HUN"
      ]
      const token = await utils.getBaiduToken()
      const res = (await fetch(
        `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          form: {
            image: imgBase64,
            language_type: langKey[self.profile.autoocr.lang[0]]
          }
        }
      ).then(res => res.json())) as {
        words_result: { words: string }[]
      } & BaiduOCRError
      if (res.error_code && res.error_msg)
        throw `${res.error_code}: ${res.error_msg}`
      return res.words_result
        .map(k => (/[.。;；·?？！!]$/.test(k.words) ? k.words + "\n" : k.words))
        .join("")
    } catch (err) {
      showHUD(String(err))
      return undefined
    }
  },
  copy(text: string) {
    UIPasteboard.generalPasteboard().string = text.trim()
    showHUD(other.success_clipboard, 2)
  }
}

const autoocr = { configs, utils }
export default autoocr
