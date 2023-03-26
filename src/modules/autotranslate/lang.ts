import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "摘录时自动翻译，作为评论添加进去。",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option1: ["自定义"] as StringTuple<1>
    },
    word_count: "[类中文字数，类英文单词数]，超过才会翻译。      ",
    translate_providers: {
      $option2: ["百度翻译", "彩云小译"] as StringTuple<2>,
      label: "翻译提供商"
    },
    caiyun_from_lang: {
      label: "输入语言",
      $option4: ["自动检测", "简体中文", "英文", "日文"] as StringTuple<4>
    },
    caiyun_to_lang: {
      label: "输出语言",
      $option3: ["简体中文", "英文", "日文"] as StringTuple<3>
    },
    no_result: "没有获取到结果",
    baidu_from_lang: {
      label: "输入语言",
      $option29: [
        "自动检测",
        "简体中文",
        "英语",
        "粤语",
        "文言文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "泰语",
        "阿拉伯语",
        "俄语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "希腊语",
        "荷兰语",
        "波兰语",
        "保加利亚语",
        "爱沙尼亚语",
        "丹麦语",
        "芬兰语",
        "捷克语",
        "罗马尼亚语",
        "斯洛文尼亚语",
        "瑞典语",
        "匈牙利语",
        "繁体中文",
        "越南语"
      ] as StringTuple<29>
    },
    baidu_to_lang: {
      label: "输出语言",
      $option28: [
        "简体中文",
        "英语",
        "粤语",
        "文言文",
        "日语",
        "韩语",
        "法语",
        "西班牙语",
        "泰语",
        "阿拉伯语",
        "俄语",
        "葡萄牙语",
        "德语",
        "意大利语",
        "希腊语",
        "荷兰语",
        "波兰语",
        "保加利亚语",
        "爱沙尼亚语",
        "丹麦语",
        "芬兰语",
        "捷克语",
        "罗马尼亚语",
        "斯洛文尼亚语",
        "瑞典语",
        "匈牙利语",
        "繁体中文",
        "越南语"
      ] as StringTuple<28>
    },
    baidu_thesaurus: {
      label: "自定义术语库",
      help: "百度翻译高级版可用，仅支持中英互译，点击新建自定义术语。",
      link: "https://fanyi-api.baidu.com/manage/term"
    },
    $show_key2: [
      "点击查看密钥，不要让其他人看到",
      "点击隐藏密钥，不要让其他人看到"
    ] as StringTuple<2>,
    baidu_app_id: {
      help: "百度 App ID，点击查看如何获取。",
      link: doc("autotranslate", "百度翻译")
    },
    baidu_secret_key: "百度密钥",
    caiyun_token: {
      help: "彩云小译 Token，点击查看如何获取。",
      link: doc("autotranslate", "彩云小译")
    },
    translate_card: {
      label: "翻译摘录内容",
      help: "会翻译卡片中所有的摘录，注意不要同时翻译太多内容。"
    },
    loading: "正在翻译...",
    translate_text: "翻译选中文字",
    no_baidu_app_id: "没有设置百度翻译的 App ID",
    no_baidu_secret_key: "没有设置百度翻译的密钥",
    no_caiyun_token: "没有设置彩云小译的 Token"
  },
  en: {
    intro: "Translate selected text or card content.",
    on: "Auto Run When Excerpting",
    preset: {
      label: "Select Preset",
      $option1: ["Custom"]
    },
    word_count: "[Chinese words, English words], if exceeded, then translate.",
    translate_providers: {
      $option2: ["Baidu Translate", "LingoCloud Translate"],
      label: "Translate Providers"
    },
    caiyun_from_lang: {
      label: "Input Language",
      $option4: ["Auto Detect", "Simplified Chinese", "English", "Japanese"]
    },
    caiyun_to_lang: {
      label: "Output Language",
      $option3: ["Simplified Chinese", "English", "Japanese"]
    },
    no_result: "No Result",
    baidu_from_lang: {
      label: "Input Language",
      $option29: [
        "Auto Detect",
        "Simplified Chinese",
        "English",
        "Cantonese",
        "Classical Chinese",
        "Japanese",
        "Korean",
        "French",
        "Spanish",
        "Thai",
        "Arabic",
        "Russian",
        "Portuguese",
        "German",
        "Italian",
        "Greek",
        "Dutch",
        "Polish",
        "Bulgarian",
        "Estonian",
        "Danish",
        "Finnish",
        "Czech",
        "Romanian",
        "Slovenian",
        "Swedish",
        "Hungarian",
        "Traditional Chinese",
        "Vietnamese"
      ]
    },
    translate_card: {
      label: "Translate Excerpt Text",
      help: "Translate all excerpts in the card, note that too many translations at the same time may cause the translation to fail."
    },
    baidu_to_lang: {
      label: "Output Language",
      $option28: [
        "Simplified Chinese",
        "English",
        "Cantonese",
        "Classical Chinese",
        "Japanese",
        "Korean",
        "French",
        "Spanish",
        "Thai",
        "Arabic",
        "Russian",
        "Portuguese",
        "German",
        "Italian",
        "Greek",
        "Dutch",
        "Polish",
        "Bulgarian",
        "Estonian",
        "Danish",
        "Finnish",
        "Czech",
        "Romanian",
        "Slovenian",
        "Swedish",
        "Hungarian",
        "Traditional Chinese",
        "Vietnamese"
      ]
    },
    baidu_thesaurus: {
      label: "Custom Thesaurus",
      help: "Only available in Baidu Translate Pro, only supports Chinese-English translation, click to create a custom thesaurus.",
      link: "https://fanyi-api.baidu.com/manage/term"
    },
    $show_key2: ["Click to show secret key", "Click to hide secret key"],
    baidu_app_id: {
      help: "Baidu Translate App ID, click to view how to get it.",
      link: doc("autotranslate", "baidu-translate")
    },
    baidu_secret_key: "Baidu Fanyi Secret Key",
    caiyun_token: {
      help: "LingoCloud Translate Token, click to view how to get it.",
      link: doc("autotranslate", "lingocloud-translate")
    },
    translate_text: "Translate Selected Text",
    loading: "Translating...",
    no_baidu_app_id: "No Baidu Fanyi App ID",
    no_baidu_secret_key: "No Baidu Fanyi Secret Key",
    no_caiyun_token: "No Caiyun Translate Token"
  }
})
