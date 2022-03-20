import type { IConfig } from "typings"
import { CellViewType, UIAlertViewStyle } from "typings/enum"
import { lang } from "./lang"
import { ActionKey } from "./enum"
import { docProfilePreset, profilePreset } from "profile"
import { Addon, MN } from "const"
import fetch from "utils/network"
import { openUrl, popup, showHUD } from "utils/common"
import { BaiduOCRError } from "./typings"
const { intro, link, label, option, help } = lang

const profileTemp = {
  ...profilePreset.autoocr,
  ...docProfilePreset.autoocr
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoOCR",
  intro:
    "使用百度 OCR API，不需要激活 OCR Pro 即可使用，并支持多个小语种。可以手动进行公式识别，手写识别。",
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      help: "【当前文档有效】"
    },
    {
      key: "lang",
      label: "识别语言",
      type: CellViewType.Select,
      option: [
        "自动检测",
        "中英文混合",
        "英文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "俄语",
        "丹麦语",
        "荷兰语",
        "马来语",
        "瑞典语",
        "印尼语",
        "波兰语",
        "罗马尼亚语",
        "土耳其语",
        "希腊语",
        "匈牙利语"
      ],
      help: "【当前文档有效】"
    },
    {
      key: "formulaOCRProviders",
      type: CellViewType.Select,
      option: ["百度", "Mathpix"],
      label: "公式识别提供商"
    },
    {
      key: "showKey",
      type: CellViewType.Switch,
      label: "显示/隐藏 Key"
    },
    {
      key: "baiduApiKey",
      type: CellViewType.Input,
      help: "百度 Api Key，点击查看如何获取。",
      bind: [["showKey", 1]]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: "百度 Secret Key",
      bind: [["showKey", 1]]
    },
    {
      key: "mathpixAppKey",
      type: CellViewType.Input,
      help: "Mathpix App Key，点击查看如何获取。",
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
      label: "公式识别",
      option: ["纯 Latex", "行内 Markdown", "行间 Markdown"],
      method: async ({ imgBase64, option }) => {
        try {
          const res =
            self.profile.autoocr.formulaOCRProviders[0] === 0
              ? await utils.baiduFormulaOCR(imgBase64)
              : await utils.mathpixOCR(imgBase64)
          UIPasteboard.generalPasteboard().string = [
            res,
            `$${res}$`,
            `$$${res}$$`
          ][option]
          showHUD("结果已复制到剪贴板上，快去粘贴吧！", 2)
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "textOCR",
      label: "文字识别",
      method: async ({ imgBase64 }) => {
        const res = await utils.main(imgBase64)
        if (res) {
          UIPasteboard.generalPasteboard().string = res
          showHUD("结果已复制到剪贴板上，快去粘贴吧！", 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "handWrittingOCR",
      label: "手写识别",
      method: async ({ imgBase64 }) => {
        try {
          const res = await utils.baiduHandWrittingOCR(imgBase64)
          UIPasteboard.generalPasteboard().string = res
          showHUD("结果已复制到剪贴板上，快去粘贴吧！", 2)
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "QRCodeOCR",
      label: "二维码识别",
      method: async ({ imgBase64 }) => {
        try {
          const res = await utils.QRCodeOCR(imgBase64)
          const url = res.match(
            /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
          )
          if (url?.[0]) {
            await popup(
              Addon.title,
              "结果已复制到剪贴板上，但检测到识别结果中含有链接，是否直接在浏览器中打开？",
              UIAlertViewStyle.Default,
              ["确定"],
              (alert: UIAlertView, buttonIndex: number) => {
                return {
                  option: buttonIndex
                }
              }
            )
            openUrl(url[0])
          } else {
            UIPasteboard.generalPasteboard().string = res
            showHUD("结果已复制到剪贴板上，快去粘贴吧！", 2)
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
    if (!res.access_token) throw "Api Key 或 Secret Key 输入错误！"
    self.profile.additional.autoocr = {
      lastGetToken: Date.now(),
      baiduToken: res.access_token
    }
    return res.access_token
  },
  async mathpixOCR(imgBase64: string) {
    const { mathpixAppKey } = self.profile.autoocr
    if (!mathpixAppKey) throw "没有输入 Mathpix key！"
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
    if (!res.latex_styled) throw "Mathpix key 输入错误！"
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
            language_type: langKey[self.docProfile.autoocr.lang[0]]
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
  }
}

const autoocr = { configs, utils }
export default autoocr
