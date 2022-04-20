import { MbBookNote } from "@/typings"
import { showHUD } from "@/utils/common"
import { reverseEscape } from "@/utils/input"
import fetch from "@/utils/network"
import { isHalfWidth, countWord } from "@/utils/text"
import MD5 from "@/utils/third party/md5"
import { TranslateProviders } from "./typings"

export function getBaiduSign(
  text: string,
  appid: string,
  key: string,
  salt: number
) {
  // appid + q + salt + 密钥
  return MD5(appid + text + salt + key)
}
export async function baiduTranslate(text: string) {
  const {
    baiduAppID,
    baiduSecretKey,
    baiduThesaurus,
    baiduFromLang,
    baiduToLang
  } = self.globalProfile.autotranslate
  if (isHalfWidth(text)) {
    if ([1, 3, 4, 5, 6, 27].includes(baiduFromLang[0])) return ""
  } else if (![1, 3, 4, 5, 6, 27].includes(baiduFromLang[0])) return ""
  const fromLangKey = [
    "auto",
    "zh",
    "en",
    "yue",
    "wyw",
    "jp",
    "kor",
    "fra",
    "spa",
    "th",
    "ara",
    "ru",
    "pt",
    "de",
    "it",
    "el",
    "nl",
    "pl",
    "bul",
    "est",
    "dan",
    "fin",
    "cs",
    "rom",
    "slo",
    "swe",
    "hu",
    "cht",
    "vie"
  ]
  const toLangKey = fromLangKey.slice(1)
  const salt = Date.now()
  const sign = getBaiduSign(text, baiduAppID, baiduSecretKey, salt)
  const res = (await fetch(
    "https://fanyi-api.baidu.com/api/trans/vip/translate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        sign,
        salt,
        q: text,
        appid: baiduAppID,
        from: fromLangKey[baiduFromLang[0]],
        to: toLangKey[baiduToLang[0]],
        action: baiduThesaurus ? 1 : 0
      }
    }
  ).then(res => res.json())) as {
    trans_result: [
      {
        src: string
        dst: string
      }
    ]
    error_code?: number
    error_msg?: string
  }
  if (res.error_code && res.error_msg)
    throw `${res.error_code}: ${res.error_msg}`
  return res.trans_result.map(k => k.dst).join("\n")
}
export async function caiyunTranslate(text: string) {
  const { caiyunToken } = self.globalProfile.autotranslate
  const { caiyunFromLang, caiyunToLang } = self.globalProfile.autotranslate
  if (isHalfWidth(text)) {
    if ([1, 4].includes(caiyunFromLang[0])) return ""
  } else if (![1, 4].includes(caiyunFromLang[0])) return ""
  const fromLangKey = ["auto", "zh", "en", "ja"]
  const toLangKey = fromLangKey.slice(1)
  const res = (await fetch(
    "http://api.interpreter.caiyunai.com/v1/translator",
    {
      method: "POST",
      headers: {
        "X-Authorization": `token ${caiyunToken}`
      },
      json: {
        source: [text],
        trans_type: `${fromLangKey[caiyunFromLang[0]]}2${
          toLangKey[caiyunToLang[0]]
        }`,
        request_id: "ohmymn",
        detect: true
      }
    }
  ).then(res => res.json())) as {
    target: string[]
  }
  if (!res.target.length) throw "没有获取到结果"
  return res.target.join("\n")
}
export async function translateText(text: string) {
  try {
    const { translateProviders, wordCount } = self.globalProfile.autotranslate
    if (wordCount) {
      const [zh, en] = reverseEscape(wordCount) as number[]
      if (countWord(text) <= (isHalfWidth(text) ? en : zh)) return undefined
    }
    const translation =
      translateProviders[0] === TranslateProviders.Baidu
        ? await baiduTranslate(text)
        : await caiyunTranslate(text)
    return [translation]
  } catch (err) {
    showHUD(String(err), 2)
    return undefined
  }
}
