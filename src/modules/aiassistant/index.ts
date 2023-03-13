import { CellViewType } from "~/typings"
import { doc } from "~/utils"
import { Prompt } from "./typings"
// import { doc } from "~/utils"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { sendtoai } from "./utils"
import { HUDController, showHUD, undoGroupingWithRefresh } from "marginnote"

export default defineConfig({
  name: "AIAssistant",
  key: "aiassistant",
  intro: lang.intro,
  link: doc("autotranslate"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateComments: {
          index: -1,
          method({ text }) {
            const request = async () => {
              const { prompt } = self.globalProfile.aiassistant
              const defaultPrompt: Prompt = prompt[0]
              const resp = await sendtoai(defaultPrompt, text)
              return [resp]
            }
            return request()
          }
        }
      }
    },
    {
      key: "wordCount",
      type: CellViewType.Input,
      help: lang.word_count
    },
    {
      key: "openaiURL",
      type: CellViewType.Input,
      help: lang.openai_url.help
    },
    {
      key: "openaiSecretKey",
      type: CellViewType.Input,
      help: lang.openai_secretkey.help
    },
    {
      key: "openaiToLang",
      type: CellViewType.Select,
      label: lang.openai_to_lang.label,
      option: lang.openai_to_lang.$option4
    },
    {
      key: "prompt",
      type: CellViewType.Select,
      label: lang.openai_prompt.label,
      option: lang.openai_prompt.$option5
    }
  ],
  actions4card: [
    {
      key: "translate",
      type: CellViewType.Button,
      label: lang.translate_card.label,
      help: lang.translate_card.help,
      method: async ({ nodes }) => {
        try {
          function getTranslatedText(text?: string) {
            if (text) return sendtoai(Prompt.Translate, text)
            else return ""
          }

          const allTranslation: string[][] = []
          HUDController.show(lang.loading)
          for (const node of nodes) {
            allTranslation.push(
              await Promise.all(
                node.notes.map(note => getTranslatedText(note.excerptText))
              )
            )
          }

          undoGroupingWithRefresh(() => {
            nodes.forEach((node, i) => {
              const translation = allTranslation[i]
              if (translation.length)
                node.removeCommentButLinkTag(
                  () => true,
                  n => {
                    n.appendTextComments(...translation)
                  }
                )
            })
          })
          HUDController.hidden()
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ],
  actions4text: [
    {
      key: "Translate",
      type: CellViewType.Button,
      label: lang.translate_text,
      method: async ({ text }) => {
        try {
          const translation = await sendtoai(Prompt.Translate, text)
          return translation
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      key: "polishing",
      type: CellViewType.Button,
      label: lang.polishing_text,
      method: async ({ text }) => {
        try {
          const resp = await sendtoai(Prompt.Polishing, text)
          return resp
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      key: "summarize",
      type: CellViewType.Button,
      label: lang.summarize_text,
      method: async ({ text }) => {
        try {
          const resp = await sendtoai(Prompt.Summarize, text)
          return resp
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      key: "analyze",
      type: CellViewType.Button,
      label: lang.analyze_text,
      method: async ({ text }) => {
        try {
          const resp = await sendtoai(Prompt.Analyze, text)
          return resp
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    },
    {
      key: "explain_code",
      type: CellViewType.Button,
      label: lang.explain_code,
      method: async ({ text }) => {
        try {
          const resp = await sendtoai(Prompt.ExplainCode, text)
          return resp
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
})
