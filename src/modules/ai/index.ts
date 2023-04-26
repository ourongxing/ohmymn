import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import lang from "./lang"

export default defineConfig({
  name: "AI",
  key: "ai",
  intro: lang.intro,
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
  ]
})
