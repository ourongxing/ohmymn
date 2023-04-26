import { showHUD } from "marginnote"
import { countWord, isLanguage } from "~/utils"
import { fetchGPTAnswer } from "../ai/utils"

export async function openaiTranslate(
  text: string,
  fromLang: number,
  toLang: number
) {
  if ([0, 1, 2, 3, 5, 6].includes(fromLang) && !isLanguage.CJK(text)) return ""
  else if (fromLang === 11 && !isLanguage.Cyrillic(text)) return ""
  else if (
    [4, 7, 8, 12, 13, 14, 15, 16, 17].includes(fromLang) &&
    !isLanguage.Latin(text)
  )
    return ""
  const fromLangKey = [
    "auto",
    "简体中文",
    "繁體中文",
    "粤语",
    "文言文",
    "English",
    "日本語",
    "한국어",
    "français",
    "español",
    "ไทย",
    "العربية",
    "русский",
    "português",
    "Deutsch",
    "italiano",
    "Ελληνικά",
    "Nederlands",
    "Polski",
    "български",
    "Eesti keel",
    "Dansk",
    "suomi",
    "čeština",
    "română",
    "slovenščina",
    "Svenska",
    "Magyar",
    "Tiếng Việt"
  ]
  const toLangKey = fromLangKey.slice(1)
  const { systemPrompt, assistantPrompt } = generatePrompt(
    text,
    fromLangKey[fromLang],
    toLangKey[toLang]
  )
  return await fetchGPTAnswer(
    [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "assistant",
        content: assistantPrompt
      }
    ],
    {
      temperature: 0
    }
  )
}

function generatePrompt(text: string, fromLang: string, toLang: string) {
  let systemPrompt =
    "You are a translation engine that can only translate text and cannot interpret it."
  let assistantPrompt = `translate from ${fromLang} to ${toLang}`
  const fromChinese = ["简体中文", "繁體中文", "粤语", "文言文"].includes(
    fromLang
  )
  const toChinese = ["简体中文", "繁體中文", "粤语", "文言文"].includes(toLang)
  if (toLang === "文言文" || toLang === "粤语") {
    assistantPrompt = `翻译成${toLang}`
  }
  if (fromChinese) {
    if (toLang === "繁体中文") {
      assistantPrompt = "翻譯成台灣常用用法之繁體中文白話文"
    } else if (toLang === "简体中文") {
      assistantPrompt = "翻译成简体白话文"
    } else if (countWord(text) <= 5 && toChinese) {
      systemPrompt = `你是一个翻译引擎，请将给到的文本翻译成${toLang}。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
                <序号><单词或短语> · /<音标>
                [<词性缩写>] <适用语境（用中文阐述）>
                例句：<例句>(例句翻译)`
      assistantPrompt = ""
    }
  }
  if (toChinese && countWord(text) === 1) {
    // 翻译为中文时，增加单词模式，可以更详细的翻译结果，包括：音标、词性、含义、双语示例。
    systemPrompt = `你是一个翻译引擎，请将翻译给到的文本，只需要翻译不需要解释。当且仅当文本只有一个单词时，请给出单词原始形态（如果有）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句，请严格按照下面格式给到翻译结果：
        <原始文本>
        [<语种>] · / <单词音标>
        [<词性缩写>] <中文含义>]
        例句：
        <序号><例句>(例句翻译)`
  }
  return {
    assistantPrompt,
    systemPrompt
  }
}

export async function translateText(text: string) {
  try {
    const { openaiToLang, openaiFromLang } = self.globalProfile.aitranslate
    return [await openaiTranslate(text, openaiFromLang[0], openaiToLang[0])]
  } catch (err) {
    showHUD(String(err), 2)
    return undefined
  }
}
