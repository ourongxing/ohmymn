import { fetch, showHUD, HUDController } from "marginnote"
import { reverseEscape, countWord, notCJK } from "~/utils"
import { Prompt } from "./typings"
import lang from "./lang"

// Prompts are borrowed from https://github.com/yetone/openai-translator
const promptMap = {
  [Prompt.Translate]: {
    systemPrompt:
      "You are a translation engine that can only translate text and cannot interpret it.",
    assistantPrompt: "translate text to"
  },
  [Prompt.Polishing]: {
    systemPrompt:
      "Revise the following sentences to make them more clear, concise, and coherent.",
    assistantPrompt: "polish this text in"
  },
  [Prompt.Summarize]: {
    systemPrompt: "You are a text summarizer.",
    assistantPrompt:
      "summarize this text in the most concise language and must use"
  },
  [Prompt.Analyze]: {
    systemPrompt: "You are a translation engine and grammar analyzer.",
    assistantPrompt:
      "translate this text and explain the grammar in the original text using "
  },
  [Prompt.ExplainCode]: {
    systemPrompt:
      "You are a code explanation engine, you can only explain the code, do not interpret or translate it. Also, please report any bugs you find in the code to the author of the code.",
    assistantPrompt:
      "explain the provided code, regex or script in the most concise language! If the content is not code, return an error message. If the code has obvious errors, point them out. Please response in Chinese"
  }
}

const langInEnglish = [
  "Simplified Chinese",
  "Traditional Chinese",
  "English",
  "Japanese"
]

export async function sendtoai(prompt: Prompt, text: string) {
  return ""
  // if (text === "") return undefined
  // try {
  //   const { wordCount, openaiToLang } = self.globalProfile.aiassistant
  //   const tolang = langInEnglish[openaiToLang[0]]
  //   if (wordCount) {
  //     const [zh, en] = reverseEscape(wordCount) as number[]
  //     if (countWord(text) <= (notCJK(text) ? en : zh)) return undefined
  //   }
  //   const { systemPrompt, assistantPrompt } = promptMap[prompt]
  //   HUDController.show(lang.loading)
  //   return ""
  // } catch (err) {
  //   showHUD(String(err), 2)
  //   HUDController.hidden()
  //   return undefined
  // }
}
