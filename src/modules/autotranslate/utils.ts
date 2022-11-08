import lang from "./lang"
import { fetch, showHUD } from "marginnote"
import { reverseEscape, countWord, isLanguage, notCJK } from "~/utils"
import MD5 from "~/utils/third party/md5"
import { TranslateProviders } from "./typings"

function getBaiduSign(text: string, appid: string, key: string, salt: number) {
  // appid + q + salt + 密钥
  return MD5(appid + text + salt + key)
}
export async function baiduTranslate(
  text: string,
  fromLang: number,
  toLang: number
) {
  const { baiduAppID, baiduSecretKey, baiduThesaurus } =
    self.globalProfile.autotranslate
  if (!baiduAppID) throw lang.no_baidu_app_id
  if (!baiduSecretKey) throw lang.no_baidu_secret_key
  if ([1, 3, 4, 5, 6, 27].includes(fromLang) && !isLanguage.CJK(text)) return ""
  else if (fromLang === 11 && !isLanguage.Cyrillic(text)) return ""
  else if (
    [2, 7, 8, 12, 13, 14, 15, 16, 17].includes(fromLang) &&
    !isLanguage.Latin(text)
  )
    return ""
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
  text = text.replace(/\n/g, "")
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
        from: fromLangKey[fromLang],
        to: toLangKey[toLang],
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

export async function caiyunTranslate(
  text: string,
  fromLang: number,
  toLang: number
) {
  const { caiyunToken } = self.globalProfile.autotranslate
  if (!caiyunToken) throw lang.no_caiyun_token
  else if ([1, 3].includes(fromLang) && !isLanguage.CJK(text)) return ""
  else if (fromLang === 2 && !/\w+/.test(text)) return ""
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
        trans_type: `${fromLangKey[fromLang]}2${toLangKey[toLang]}`,
        request_id: "ohmymn",
        detect: true
      }
    }
  ).then(res => res.json())) as {
    target: string[]
  }
  if (!res.target.length) throw lang.no_result
  return res.target.join("\n")
}

export async function translateText(text: string) {
  try {
    const {
      translateProviders,
      wordCount,
      baiduFromLang,
      baiduToLang,
      caiyunFromLang,
      caiyunToLang
    } = self.globalProfile.autotranslate
    if (wordCount) {
      const [zh, en] = reverseEscape(wordCount) as number[]
      if (countWord(text) <= (notCJK(text) ? en : zh)) return undefined
    }
    const translation =
      translateProviders[0] === TranslateProviders.Baidu
        ? await baiduTranslate(text, baiduFromLang[0], baiduToLang[0])
        : await caiyunTranslate(text, caiyunFromLang[0], caiyunToLang[0])
    return [translation]
  } catch (err) {
    showHUD(String(err), 2)
    return undefined
  }
}
