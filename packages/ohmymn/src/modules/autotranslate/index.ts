import { CellViewType } from "~/typings"
import { doc } from "~/utils"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { TranslateProviders } from "./typings"
import { baiduTranslate, caiyunTranslate, translateText } from "./utils"
import { HUDController, showHUD, undoGroupingWithRefresh } from "marginnote"

export default defineConfig({
  name: "AutoTranslate",
  key: "autotranslate",
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
      key: "translateProviders",
      type: CellViewType.Select,
      option: lang.translate_providers.$option2,
      label: lang.translate_providers.label
    },
    {
      key: "caiyunFromLang",
      type: CellViewType.Select,
      label: lang.caiyun_from_lang.label,
      option: lang.caiyun_from_lang.$option4,
      bind: ["translateProviders", 1]
    },
    {
      key: "caiyunToLang",
      type: CellViewType.Select,
      label: lang.caiyun_to_lang.label,
      option: lang.caiyun_to_lang.$option3,
      bind: ["translateProviders", 1]
    },
    {
      key: "baiduFromLang",
      type: CellViewType.Select,
      label: lang.baidu_from_lang.label,
      option: lang.baidu_from_lang.$option29,
      bind: ["translateProviders", 0]
    },
    {
      key: "baiduToLang",
      type: CellViewType.Select,
      label: lang.baidu_to_lang.label,
      option: lang.baidu_to_lang.$option28,
      bind: ["translateProviders", 0]
    },
    {
      key: "baiduThesaurus",
      type: CellViewType.Switch,
      label: lang.baidu_thesaurus.label,
      help: lang.baidu_thesaurus.help,
      link: lang.baidu_thesaurus.link,
      bind: ["translateProviders", 0]
    },
    {
      key: "showKey",
      type: CellViewType.Expland,
      label: lang.$show_key2
    },
    {
      key: "baiduAppID",
      type: CellViewType.Input,
      help: lang.baidu_app_id.help,
      link: lang.baidu_app_id.link,
      bind: [
        ["showKey", true],
        ["translateProviders", 0]
      ]
    },
    {
      key: "baiduSecretKey",
      type: CellViewType.Input,
      help: lang.baidu_secret_key,
      bind: [
        ["showKey", true],
        ["translateProviders", 0]
      ]
    },
    {
      key: "caiyunToken",
      type: CellViewType.Input,
      help: lang.caiyun_token.help,
      link: lang.caiyun_token.link,
      bind: [
        ["showKey", true],
        ["translateProviders", 1]
      ]
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
          const {
            translateProviders,
            baiduFromLang,
            baiduToLang,
            caiyunFromLang,
            caiyunToLang
          } = self.globalProfile.autotranslate

          function getTranslatedText(text?: string) {
            try {
              if (text)
                return translateProviders[0] === TranslateProviders.Baidu
                  ? baiduTranslate(text, baiduFromLang[0], baiduToLang[0])
                  : caiyunTranslate(text, caiyunFromLang[0], caiyunToLang[0])
              else return ""
            } catch {
              return ""
            }
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
                    if (self.globalProfile.addon.useMarkdown)
                      n.appendMarkdownComments(...translation)
                    else n.appendTextComments(...translation)
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
      key: "translateText",
      type: CellViewType.Button,
      label: lang.translate_text,
      method: async ({ text }) => {
        try {
          const {
            translateProviders,
            baiduFromLang,
            baiduToLang,
            caiyunFromLang,
            caiyunToLang
          } = self.globalProfile.autotranslate
          const translation =
            translateProviders[0] === TranslateProviders.Baidu
              ? await baiduTranslate(text, baiduFromLang[0], baiduToLang[0])
              : await caiyunTranslate(text, caiyunFromLang[0], caiyunToLang[0])
          return translation
        } catch (err) {
          showHUD(String(err), 2)
        }
      }
    }
  ]
})
