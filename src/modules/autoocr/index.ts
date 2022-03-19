import { getExcerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import type { ICheckMethod, IConfig } from "typings"
import { CellViewType } from "typings/enum"
import { lang } from "./lang"
import { ActionKey } from "./enum"
import { docProfilePreset, profilePreset } from "profile"
import { MN } from "const"
import fetch from "utils/network"
import { showHUD } from "utils/common"
const { intro, link, label, option, help } = lang

const profileTemp = {
  ...profilePreset.autoocr,
  ...docProfilePreset.autoocr
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoOCR",
  intro: "使用百度 OCR API，不需要激活 OCR Pro 即可使用，并支持多个小语种。",
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      help: "当前文档有效"
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
      help: "当前文档有效"
    },
    {
      key: "showKey",
      type: CellViewType.Switch,
      label: "显示/隐藏 Key"
    },
    {
      key: "apiKey",
      type: CellViewType.Input,
      help: "Api Key",
      bind: [["showKey", 1]]
    },
    {
      key: "secretKey",
      type: CellViewType.Input,
      help: "Secret Key",
      bind: [["showKey", 1]]
    }
  ]
}

const utils = {
  async getToken(apiKey: string, secretKey: string) {
    const res = (await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
    ).then(res => res.json())) as { access_token: string }
    if (!res.access_token) throw "Api Key 或 Secret Key 输入错误！"
    self.profile.additional.autoocr = {
      lastGetToken: Date.now(),
      baiduToken: res.access_token
    }
    return res.access_token
  },
  async main() {
    try {
      const base64 = MN.studyController()
        .readerController.currentDocumentController.imageFromFocusNote()
        .base64Encoding()
      const { lastGetToken, baiduToken } = self.profile.additional.autoocr
      const { apiKey, secretKey } = self.profile.autoocr
      const token =
        baiduToken && Date.now() - lastGetToken < 2592000000
          ? baiduToken
          : await utils.getToken(apiKey, secretKey)
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
      const res = (await fetch(
        `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          form: {
            image: base64,
            language_type: langKey[self.docProfile.autoocr.lang[0]]
          }
        }
      ).then(res => res.json())) as { words_result: { words: string }[] }
      console.assert(res, "ocr")
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
