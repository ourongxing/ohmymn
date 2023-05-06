import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro: "使用 OpenAI API 来增强 OhMyMN 模块。",
    $show_key2: [
      "点击查看 Key，不要让其他人看到",
      "点击隐藏 Key，不要让其他人看到"
    ] as StringTuple<2>,
    openai_base_url: {
      help: "OpenAI API 服务器地址",
      link: ""
    },
    prompts_url: {
      help: "Prompts 数据源，填写一张卡片的链接。点击查看具体格式。修改后需要重新回车更新。",
      not_link: "不是有效的链接",
      not_found: "未找到卡片",
      no_child: "卡片没有子卡片",
      no_prompts: "Prompts 数据源为空或者格式错误",
      link: ""
    },
    defaultTemperature: {
      label: "思维发散程度",
      help: "OpenAI temperature 参数，0-2，不建议超过 2。需要准确回答请尽量调小",
      number: "请输入 0-2 之间的数字"
    },
    aiAction: {
      label: "AI 动作",
      help: "读取 Prompts 数据源中的 Prompts",
      $option6: [
        "标题→评论",
        "摘录→标题",
        "摘录→评论",
        "卡片→标题",
        "卡片→标签",
        "卡片→评论"
      ],
      select_prompts: "选择 Prompts",
      select_io: "选择输入输出"
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
    aiAction: {
      label: "AI Action",
      select_io: "Select input and output",
      help: "Fetch Prompts in Prompts data source",
      select_prompts: "Select Prompts",
      $option6: [
        "Title → Comment",
        "Excerpt → Title",
        "Excerpt → Comment",
        "Card → Title",
        "Card → Tag",
        "Card → Comment"
      ]
    },
    loading: "AI is thinking...",
    translate_text: "Translate",
    polishing_text: "Polish",
    summarize_text: "Summarize",
    analyze_text: "Analyze sentence",
    explain_code: "Explain code",
    no_openai_secretkey: "OpenAI API Key not set",
    prompts_url: {
      help: "Prompts data source, fill in the link of a card. Click to view the specific format. You need to press Enter to update after modification.",
      link: "",
      not_link: "Not a valid link",
      not_found: "Card not found",
      no_child: "Card has no child cards",
      no_prompts: "Prompts data source is empty or the format is wrong"
    },
    defaultTemperature: {
      label: "Temperature",
      help: "OpenAI Temperature parameter, 0-2, not recommended to exceed 2. Please try to reduce it if you need to answer accurately",
      number: "Please enter a number between 0-2"
    }
  }
})
