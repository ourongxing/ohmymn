import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro: "使用 OpenAI API 来增强 OhMyMN 模块。",
    $show_key2: [
      "点击查看密钥，不要让其他人看到",
      "点击隐藏密钥，不要让其他人看到"
    ] as StringTuple<2>,
    openai_base_url: {
      help: "OpenAI API 服务器地址",
      link: ""
    },
    openai_api_key: {
      help: "OpenAI API Key",
      link: ""
    },
    model: {
      label: "OpenAI 模型",
      $option3: ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k"] as StringTuple<3>
    },
    no_result: "没有获取到结果",
    process_card: {
      label: "AI处理摘录内容",
      help: "根据 AIAssistant 设置中的功能处理卡片中所有的摘录，注意不要同时提交太多内容。"
    },
    loading: "AI 正在思考...",
    translate_text: "翻译",
    polishing_text: "润色",
    summarize_text: "总结",
    analyze_text: "解析句子",
    explain_code: "解释代码",
    no_openai_secretkey: "没有设置OpenAI API Key"
  },
  en: {
    intro: "Use OpenAI API to enhance the OhMyMN module.",
    $show_key2: [
      "Click to view the key, don't let others see",
      "Click to hide the key, don't let others see"
    ] as StringTuple<2>,
    openai_base_url: {
      help: "OpenAI API Base URL",
      link: ""
    },
    openai_api_key: {
      help: "OpenAI API Key",
      link: ""
    },
    model: {
      label: "OpenAI Model",
      $option3: ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k"]
    },
    no_result: "No result obtained",
    process_card: {
      label: "AI process excerpt content",
      help: "Process all excerpts in the card according to the functions set in AIAssistant. Be careful not to submit too much content at the same time."
    },
    loading: "AI is thinking...",
    translate_text: "Translate",
    polishing_text: "Polish",
    summarize_text: "Summarize",
    analyze_text: "Analyze sentence",
    explain_code: "Explain code",
    no_openai_secretkey: "OpenAI API Key not set"
  }
})
