import { fetch, showHUD, HUDController } from "marginnote"
import lang from "./lang"
import type { ChatMessage } from "./typings"

export async function fetchGPTAnswer(
  messages: ChatMessage[],
  options?: {
    temperature?: number
    max_tokens?: number
  }
) {
  try {
    const { OpenAIApiKey, OpenAIBaseURL, model } = self.globalProfile.ai
    if (!OpenAIApiKey) throw lang.no_openai_secretkey
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OpenAIApiKey}`
    }
    let baseURL = OpenAIBaseURL
    if (OpenAIBaseURL.trim() === "") {
      baseURL = "api.openai.com"
    }
    const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k"]
    const body = {
      model: models[model[0]],
      temperature: 0.6,
      ...options,
      messages
    }

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
    if (!res.choices || res.choices.length > 0) {
      return res.choices[0].message.content.trim()
    }
  } catch (err) {
    showHUD(String(err), 2)
    HUDController.hidden()
    return undefined
  }
}
