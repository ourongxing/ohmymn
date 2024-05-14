import {
  fetch,
  HUDController,
  NodeNote,
  MbBookNote,
  undoGroupingWithRefresh
} from "marginnote"
import lang from "./lang"
import type { AIActionIO, ChatMessage, Model, Prompt } from "./typings"
const models = ["gpt-3.5-turbo", "gpt-4-turbo"] as Model[]

function findModel(model: string) {
  switch (model) {
    case "gpt-3.5":
      return "gpt-3.5-turbo"
    case "gpt-4":
      return "gpt-4-turbo"
    default:
      return "gpt-3.5-turbo"
  }
}

export function fetchPrompts(note?: MbBookNote): Prompt[] {
  if (note === undefined) {
    const { promptsURL } = self.globalProfile.ai
    if (promptsURL) {
      const noteid = promptsURL.replace(MN.scheme + "://note/", "")
      note = MN.db.getNoteById(noteid)
    }
  }
  if (note) {
    const node = new NodeNote(note)
    const prompts: Prompt[] = []
    undoGroupingWithRefresh(() => {
      node.childNodes.forEach((k, i) => {
        k.title = `${i}. ${k.title.replace(/^\d+\. /, "")}`
        const optionStr = k.commentsText?.[1]?.split("\n")
        const options: Prompt["options"] = {}
        if (optionStr?.length) {
          const ioOpt = [
            "title2title",
            "title2comment",
            "excerpt2title",
            "excerpt2comment",
            "card2title",
            "card2tag",
            "card2comment",
            "selected_text"
          ]
          const io = optionStr
            .find(k => /io/i.test(k))
            ?.match(new RegExp(ioOpt.join("|"), "ig"))
          if (io?.length) {
            options.io = io.map(k => ioOpt.indexOf(k)) as AIActionIO[]
          }

          const model = optionStr
            .find(k => /model/i.test(k))
            ?.match(/gpt-3.5|gpt-4/)
          if (model?.length) {
            options.model = findModel(model[0])
          }
          const temperature = optionStr
            .find(k => /temperature/i.test(k))
            ?.match(/\d+\.\d+|\d+/)
          if (temperature?.length) {
            const num = Number(temperature[0])
            if (!Number.isNaN(num) && num >= 0 && num <= 2)
              options.temperature = num
          }
          const maxTokens = optionStr
            .find(k => /max-tokens/i.test(k))
            ?.match(/\d+\.\d+|\d+/)
          if (maxTokens?.length) {
            const num = Number(maxTokens[0])
            if (!Number.isNaN(num)) options["max_tokens"] = num
          }
        }
        prompts.push({
          desc: k.title,
          content: k.commentsText[0],
          options
        })
      })
    })
    return prompts
  }
  return []
}

export async function fetchGPTAnswer(
  messages: ChatMessage[],
  options?: {
    temperature?: number
    max_tokens?: number
    model?: Model
  }
): Promise<string | undefined> {
  try {
    const { OpenAIApiKey, OpenAIBaseURL, model, defaultTemperature } =
      self.globalProfile.ai
    if (!OpenAIApiKey) throw lang.no_openai_secretkey
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OpenAIApiKey}`
    }
    let baseURL = OpenAIBaseURL
    if (OpenAIBaseURL.trim() === "") {
      baseURL = "api.openai.com"
    }
    const body = {
      model: models[model[0]],
      temperature: Number(defaultTemperature),
      messages
    }
    if (options?.model) body.model = options.model
    if (options?.temperature) body.temperature = options.temperature
    // @ts-ignore
    if (options?.max_tokens) body.max_tokens = options.max_tokens

    HUDController.show(lang.loading)
    const res = await fetch(
      `https://${baseURL.replace(/^https?:\/\//, "")}/v1/chat/completions`,
      {
        method: "POST",
        headers: headers,
        timeout: 60,
        json: body
      }
    ).then(function (res) {
      return res.json()
    })
    HUDController.hidden()
    if (res?.error?.message) throw res.error.message
    if (res?.choices?.length > 0) {
      return res.choices[0].message.content.trim()
    }
  } catch (err) {
    HUDController.hidden("AI: " + String(err), 2)
    return
  }
}
