import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { fetchGPTAnswer, fetchPrompts } from "./utils"
import { Addon } from "~/addon"
import { AIActionIO } from "./typings"
import { select, showHUD, undoGroupingWithRefresh } from "marginnote"
import { clearTags } from "../autotag"
import { doc } from "~/utils"

export default defineConfig({
  name: "AI",
  key: "ai",
  intro: lang.intro,
  link: doc("ai"),
  settings: [
    {
      key: "OpenAIBaseURL",
      type: CellViewType.Input,
      help: lang.openai_base_url.help
    },
    {
      key: "model",
      type: CellViewType.Select,
      label: lang.model.label,
      option: lang.model.$option3
    },
    {
      key: "promptsURL",
      type: CellViewType.Input,
      help: lang.prompts_url.help,
      link: lang.prompts_url.link,
      check({ input }) {
        const noteid = input.replace("marginnote3app://note/", "")
        if (noteid === input) throw lang.prompts_url.not_link
        const note = MN.db.getNoteById(noteid)
        if (!note) throw lang.prompts_url.not_found
        if (!note.childNotes?.length) throw lang.prompts_url.no_child
        const prompts = fetchPrompts(note)
        if (!prompts?.length) throw lang.prompts_url.no_prompts
        Addon.prompts = prompts
      }
    },
    {
      key: "defaultTemperature",
      type: CellViewType.InlineInput,
      label: lang.defaultTemperature.label,
      help: lang.defaultTemperature.help,
      check({ input }) {
        const num = Number(input)
        if (Number.isNaN(num) || num < 0 || num > 2)
          throw lang.defaultTemperature.number
      }
    },
    {
      key: "showKey",
      type: CellViewType.Expland,
      label: lang.$show_key2
    },
    {
      key: "OpenAIApiKey",
      type: CellViewType.Input,
      help: lang.openai_api_key.help,
      bind: [["showKey", true]]
    }
  ],
  actions4card: [
    {
      key: "aiAction",
      type: CellViewType.ButtonWithInput,
      label: lang.aiAction.label,
      option: lang.aiAction.$option6,
      async method({ nodes, option, content }) {
        const { defaultTemperature } = self.globalProfile.ai
        for (const node of nodes) {
          const input = (() => {
            switch (option) {
              case AIActionIO.card2comment:
              case AIActionIO.card2tag:
              case AIActionIO.card2title:
                return node.allText
              case AIActionIO.excerpt2comment:
              case AIActionIO.excerpt2title:
                return node.excerptsText.join("\n")
              default:
                return node.title
            }
          })()
          const output = await fetchGPTAnswer(
            [
              {
                content: `${content}\: ${input}`,
                role: "assistant"
              }
            ],
            {
              temperature: Number(defaultTemperature)
            }
          )
          if (output) {
            undoGroupingWithRefresh(() => {
              switch (option) {
                case AIActionIO.card2comment:
                case AIActionIO.excerpt2comment:
                case AIActionIO.title2comment:
                  node.appendTextComments(output)
                  break
                case AIActionIO.card2title:
                case AIActionIO.title2title:
                case AIActionIO.excerpt2title:
                  node.title = output
                  break
                case AIActionIO.card2tag:
                  // 使用空格隔开多个标签
                  node.appendTags(...clearTags(output))
              }
            })
          }
        }
      }
    },
    {
      key: "aiActionPrompts",
      type: CellViewType.Button,
      label: lang.aiAction.label + " (Prompts)",
      option: [],
      async method({ nodes, option }) {
        if (!Addon.prompts?.length) {
          const prompts = fetchPrompts()
          if (prompts?.length) {
            Addon.prompts = prompts
          } else {
            showHUD(lang.prompts_url.no_prompts)
            return
          }
        }

        const cardPrompts = Addon.prompts.filter(
          k => k.options.io === undefined || !k.options.io.includes(7)
        )
        let index = 0
        if (option !== -1) index = option
        else
          index = (
            await select(
              cardPrompts.map(k => k.desc.replace(/^\d+\. /, "")),
              "AI",
              lang.aiAction.select_prompts,
              true
            )
          ).index
        if (index === -1) return
        const prompt = cardPrompts[index]

        for (const node of nodes) {
          const options =
            prompt.options?.io ?? ([0, 1, 2, 3, 4, 5] as AIActionIO[])
          let io = options[0]
          if (options.length > 1) {
            const { index } = await select(
              lang.aiAction.$option6.filter((_, i) => options.includes(i)),
              "AI",
              lang.aiAction.select_io
            )
            io = index
          }
          const input = (() => {
            switch (io) {
              case AIActionIO.card2comment:
              case AIActionIO.card2tag:
              case AIActionIO.card2title:
                return node.allText
              case AIActionIO.excerpt2comment:
              case AIActionIO.excerpt2title:
                return node.excerptsText.join("\n")
              default:
                return node.title
            }
          })()
          const output = await fetchGPTAnswer(
            [
              {
                content: prompt.content,
                role: "system"
              },
              {
                content: input,
                role: "user"
              }
            ],
            prompt.options
          )
          if (output) {
            undoGroupingWithRefresh(() => {
              switch (io) {
                case AIActionIO.card2comment:
                case AIActionIO.excerpt2comment:
                case AIActionIO.title2comment:
                  node.appendTextComments(output)
                  break
                case AIActionIO.card2title:
                case AIActionIO.excerpt2title:
                case AIActionIO.title2title:
                  node.title = output
                  break
                case AIActionIO.card2tag:
                  node.appendTags(...clearTags(output))
              }
            })
          }
        }
      }
    }
  ],
  actions4text: [
    {
      key: "aiActionPromptsText",
      type: CellViewType.Button,
      label: lang.aiAction.label + " (Prompts)",
      option: [],
      async method({ text, option }) {
        if (!Addon.prompts?.length) {
          const prompts = fetchPrompts()
          if (prompts?.length) {
            Addon.prompts = prompts
          } else {
            showHUD(lang.prompts_url.no_prompts)
            return
          }
        }

        const textPrompts = Addon.prompts.filter(
          k => k.options.io === undefined || k.options.io.includes(7)
        )
        let index = 0
        if (option !== -1) index = option
        else {
          index = (
            await select(
              textPrompts.map(k => k.desc.replace(/^\d+\. /, "")),
              "AI",
              lang.aiAction.select_prompts,
              true
            )
          ).index
        }
        if (index === -1) return
        const prompt = textPrompts[index]
        const output = await fetchGPTAnswer(
          [
            {
              content: prompt.content,
              role: "system"
            },
            {
              content: text,
              role: "user"
            }
          ],
          prompt.options
        )
        return output
      }
    }
  ]
})
