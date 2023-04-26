import { CellViewType } from "~/typings"
import { doc } from "~/utils"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { HUDController, showHUD } from "marginnote"
import { translateText } from "./utils"

export default defineConfig({
  name: "AiTranslate",
  key: "aitranslate",
  intro: lang.intro,
  link: doc("aitranslate"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateComments: {
          index: -1,
          method({ text }) {
            return translateText(text)
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
      key: "openaiFromLang",
      type: CellViewType.Select,
      label: lang.openai_from_lang.label,
      option: lang.openai_from_lang.$option28
    },
    {
      key: "openaiToLang",
      type: CellViewType.Select,
      label: lang.openai_to_lang.label,
      option: lang.openai_to_lang.$option28
    }
  ],
  actions4card: [
    {
      key: "translateCard",
      type: CellViewType.Button,
      label: lang.translate_card.label,
      help: lang.translate_card.help,
      method: async ({ nodes }) => {
        try {
          const allTranslation: string[][] = []
          HUDController.show(lang.loading)
          // for (const node of nodes) {
          //   allTranslation.push(
          //     await Promise.all(
          //       node.notes.map(note => getTranslatedText(note.excerptText))
          //     )
          //   )
          // }

          // undoGroupingWithRefresh(() => {
          //   nodes.forEach((node, i) => {
          //     const translation = allTranslation[i]
          //     if (translation.length)
          //       node.removeCommentButLinkTag(
          //         () => true,
          //         n => {
          //           n.appendTextComments(...translation)
          //         }
          //       )
          //   })
          // })
          HUDController.hidden()
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ],
  actions4text: [
    {
      key: "translateText",
      type: CellViewType.Button,
      label: lang.translate_text,
      method: async ({ text }) => {
        try {
          // return translation
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
})
