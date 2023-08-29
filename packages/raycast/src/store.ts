import { getPreferenceValues, LocalStorage } from "@raycast/api"
import {
  CustomShortcut,
  LocalShortcut,
  OhMyMNAction,
  Preferences,
  SharedShortcut
} from "./typings"

const { actionInChinese } = getPreferenceValues<Preferences>()
export const cardActionsEN = [
  {
    key: "manageProfile",
    type: 2,
    label: "Manage Profile",
    option: [
      "Read Profile",
      "Write Profile",
      "Reset Profile",
      "Sync Profile with Other Windows"
    ],
    help: "Please make sure that the card has at least one child card when writing the profile. Multiple child cards can share the profile together to prevent a single card from having too many words.",
    module: "magicaction4card",
    moduleName: "MagicAction For Card"
  },
  {
    type: 3,
    label: "Filter Cards",
    option: ["All", "Title", "Excerpt", "Comment", "Tag"],
    key: "filterCard",
    module: "magicaction4card",
    moduleName: "MagicAction For Card"
  },
  {
    type: 2,
    label: "Merge Multiple Cards",
    key: "mergeCard",
    option: ["Merge Title", "Not Merge Titles"],
    module: "magicaction4card",
    moduleName: "MagicAction For Card"
  },
  {
    type: 3,
    label: "Rename Titles",
    key: "renameTitle",
    help: "$& refers to the original title. Enter \"%['1'] $&\" to Quickly number the selected card title.",
    module: "magicaction4card",
    moduleName: "MagicAction For Card",
    option: ["Confirm"]
  },
  {
    type: 2,
    label: "Merge Text",
    key: "mergeText",
    option: ["Merged as Excerpt", "Merged as Comment"],
    help: "Only support merging text excerpt and text comment, not merging tags and link, other content will be pinned after merging",
    module: "magicaction4card",
    moduleName: "MagicAction For Card"
  },
  {
    key: "switchTitle",
    type: 2,
    label: "Switch Excerpt / Title",
    option: ["Switch to Non-Existent", "Swap Title and Excerpt"],
    help: "Use [Swap Title and Excerpt] when both are present」",
    module: "magicaction4card",
    moduleName: "MagicAction For Card"
  },
  {
    type: 3,
    label: "Extract Title",
    option: ["Use AutoDef Settings", "Confirm"],
    key: "extractTitle",
    moduleName: "Another AutoDef",
    module: "anotherautodef",
    help: "This action comes from Another AutoDef and uses the same settings. "
  },
  {
    type: 3,
    label: "Split Excerpt Text",
    key: "splitExcerpt",
    option: ["Use AutoDef Settings", "Confirm"],
    help: "This action comes from Another AutoDef and uses the same settings. Split the excerpt into title (definiendum) and excerpt (definiens) parts.",
    moduleName: "Another AutoDef",
    module: "anotherautodef"
  },
  {
    key: "formatCard",
    type: 2,
    label: "Format Excerpt Text",
    option: ["All", "Only Title", "Only Excerpt Text"],
    moduleName: "AutoFormat",
    module: "autoformat",
    help: "This action comes from AutoFormat and uses the same settings. "
  },
  {
    key: "completeWord",
    type: 2,
    label: "Generate Word Card",
    option: ["Append", "Replace"],
    moduleName: "AutoComplete",
    module: "autocomplete",
    help: "This action comes from AutoComplete and uses the same settings. "
  },
  {
    type: 3,
    label: "Replace Excerpt Text",
    key: "replaceCard",
    option: ["Use AutoReplace Settings", "Confirm"],
    moduleName: "AutoReplace",
    module: "autoreplace",
    help: "This action comes from AutoReplace and uses the same settings. "
  },
  {
    type: 3,
    label: "Add Line Breaks",
    key: "listCard",
    option: ["Use AutoList Settings", "Confirm"],
    moduleName: "AutoList",
    module: "autolist",
    help: "This action comes from AutoList and uses the same settings. "
  },
  {
    type: 3,
    label: "Add Tags",
    key: "addTag",
    option: ["Use AutoTag Settings", "Confirm"],
    moduleName: "AutoTag",
    module: "autotag",
    help: "This action comes from AutoTag and uses the same settings. "
  },
  {
    type: 3,
    label: "Modify Excerpt Color",
    key: "changeColor",
    option: ["Use AutoStyle Settings", "Confirm"],
    help: "This action comes from AutoStyle and uses the same settings. Enter the color index, 1 to 16",
    moduleName: "AutoStyle",
    module: "autostyle"
  },
  {
    type: 2,
    label: "Modify Excerpt Style",
    key: "changeStyle",
    option: ["Use AutoStyle Settings", "Outline+Fill", "Fill", "Outline"],
    moduleName: "AutoStyle",
    module: "autostyle",
    help: "This action comes from AutoStyle and uses the same settings. "
  },
  {
    type: 2,
    key: "searchCardInfo",
    label: "Search Card Content",
    option: [
      "Chinese",
      "English",
      "Dict",
      "Translation",
      "Academic",
      "Question",
      "Other"
    ],
    moduleName: "CopySearch",
    module: "copysearch",
    help: "This action comes from CopySearch and uses the same settings. "
  },
  {
    type: 2,
    key: "copyCardInfo",
    label: "Copy Card Content",
    option: ["Dynamic Selection", "Title First", "Excerpt First", "Custom"],
    moduleName: "CopySearch",
    module: "copysearch",
    help: "This action comes from CopySearch and uses the same settings. "
  },
  {
    key: "translateCard",
    type: 2,
    label: "Translate Excerpt Text",
    help: "This action comes from AutoTranslate and uses the same settings. Translate all excerpts in the card, note that too many translations at the same time may cause the translation to fail.",
    moduleName: "AutoTranslate",
    module: "autotranslate",
    option: ["Confirm"]
  },
  {
    type: 3,
    label: "Add Comment",
    key: "addComment",
    option: ["Use AutoComment Settings", "Confirm"],
    moduleName: "AutoComment",
    module: "autocomment",
    help: "This action comes from AutoComment and uses the same settings. "
  },
  {
    type: 2,
    label: "Convert to Simplified Chinese",
    key: "simplifyCard",
    option: ["Excerpt and Title", "Only Excerpt", "Only Title"],
    moduleName: "AutoSimplify",
    module: "autosimplify",
    help: "This action comes from AutoSimplify and uses the same settings. "
  }
]
export const textActionsEN = [
  {
    type: 2,
    key: "copyText",
    label: "Copy Selected Text",
    module: "magicaction4text",
    moduleName: "MagicAction For Text",
    option: ["Confirm"]
  },
  {
    type: 2,
    key: "searchText",
    label: "Search Selected Text",
    option: [
      "Chinese",
      "English",
      "Dict",
      "Translation",
      "Academic",
      "Question",
      "Other"
    ],
    moduleName: "CopySearch",
    module: "copysearch",
    help: "This action comes from CopySearch and uses the same settings. "
  },
  {
    type: 2,
    key: "formulaOCR",
    label: "Formula OCR",
    option: ["Pure Latex", "$ Latex $", "$$ Latex $$"],
    help: 'This action comes from AutoOCR and uses the same settings. For "Markdown" Addon, please choose Pure Latex',
    moduleName: "AutoOCR",
    module: "autoocr"
  },
  {
    type: 2,
    key: "textOCR",
    label: "Text OCR",
    moduleName: "AutoOCR",
    module: "autoocr",
    help: "This action comes from AutoOCR and uses the same settings. ",
    option: ["Confirm"]
  },
  {
    type: 2,
    key: "handWrittingOCR",
    label: "Handwritting OCR",
    moduleName: "AutoOCR",
    module: "autoocr",
    help: "This action comes from AutoOCR and uses the same settings. ",
    option: ["Confirm"]
  },
  {
    type: 2,
    key: "QRCodeOCR",
    label: "QRCode OCR",
    moduleName: "AutoOCR",
    module: "autoocr",
    help: "This action comes from AutoOCR and uses the same settings. ",
    option: ["Confirm"]
  },
  {
    key: "translateText",
    type: 2,
    label: "Translate Selected Text",
    moduleName: "AutoTranslate",
    module: "autotranslate",
    help: "This action comes from AutoTranslate and uses the same settings. ",
    option: ["Confirm"]
  },
  {
    type: 2,
    label: "Convert to Simplified Chinese",
    key: "simplifyText",
    moduleName: "AutoSimplify",
    module: "autosimplify",
    help: "This action comes from AutoSimplify and uses the same settings. ",
    option: ["Confirm"]
  }
]

export const cardActions = (
  actionInChinese
    ? [
        {
          key: "manageProfile",
          type: 2,
          label: "配置管理",
          option: ["读取配置", "写入配置", "重置配置", "同步其他窗口的配置"],
          help: "写入配置时请确保该卡片至少有一张子卡片。多张子卡片可以一起分担配置，防止单张卡片字数过多。",
          module: "magicaction4card",
          moduleName: "MagicAction For Card"
        },
        {
          type: 3,
          label: "筛选卡片",
          option: ["所有", "标题", "摘录", "评论", "标签"],
          key: "filterCard",
          module: "magicaction4card",
          moduleName: "MagicAction For Card"
        },
        {
          type: 2,
          label: "合并卡片",
          key: "mergeCard",
          option: ["同时合并标题", "不合并标题"],
          module: "magicaction4card",
          moduleName: "MagicAction For Card"
        },
        {
          type: 3,
          label: "重命名标题",
          key: "renameTitle",
          help: "$& 指代原标题。输入 \"%['1'] $&\" 可快速为选中卡片标题编号。",
          module: "magicaction4card",
          moduleName: "MagicAction For Card",
          option: ["确定"]
        },
        {
          type: 2,
          label: "合并卡片内文字",
          key: "mergeText",
          option: ["合并为摘录", "合并为评论"],
          help: "仅支持合并文字摘录和文字评论，不合并标签和链接，其余内容会在合并后置顶。",
          module: "magicaction4card",
          moduleName: "MagicAction For Card"
        },
        {
          key: "switchTitle",
          type: 2,
          label: "切换摘录标题",
          option: ["切换为不存在的", "交换标题和摘录"],
          help: "当两者都存在时请使用「交换标题和摘录」。",
          module: "magicaction4card",
          moduleName: "MagicAction For Card"
        },
        {
          type: 3,
          label: "提取标题",
          option: ["使用 AutoDef 中的设置", "确定"],
          key: "extractTitle",
          moduleName: "Another AutoDef",
          module: "anotherautodef",
          help: "该动作来自于 Another AutoDef，与其使用相同的设置。"
        },
        {
          type: 3,
          label: "拆分摘录",
          key: "splitExcerpt",
          option: ["使用 AutoDef 中的设置", "确定"],
          help: "该动作来自于 Another AutoDef，与其使用相同的设置。将摘录拆分为标题（被定义项）和摘录（定义项）两部分。",
          moduleName: "Another AutoDef",
          module: "anotherautodef"
        },
        {
          key: "formatCard",
          type: 2,
          label: "优化排版格式",
          option: ["标题和摘录", "仅标题", "仅摘录"],
          moduleName: "AutoFormat",
          module: "autoformat",
          help: "该动作来自于 AutoFormat，与其使用相同的设置。"
        },
        {
          key: "completeWord",
          type: 2,
          label: "英文单词制卡",
          option: ["追加", "替换"],
          moduleName: "AutoComplete",
          module: "autocomplete",
          help: "该动作来自于 AutoComplete，与其使用相同的设置。"
        },
        {
          type: 3,
          label: "替换摘录内容",
          key: "replaceCard",
          option: ["使用 AutoReplace 的设置", "确定"],
          moduleName: "AutoReplace",
          module: "autoreplace",
          help: "该动作来自于 AutoReplace，与其使用相同的设置。"
        },
        {
          type: 3,
          label: "添加换行",
          key: "listCard",
          option: ["使用 AutoList 的设置", "确定"],
          moduleName: "AutoList",
          module: "autolist",
          help: "该动作来自于 AutoList，与其使用相同的设置。"
        },
        {
          type: 3,
          label: "添加标签",
          key: "addTag",
          option: ["使用 AutoTag 的设置", "确定"],
          moduleName: "AutoTag",
          module: "autotag",
          help: "该动作来自于 AutoTag，与其使用相同的设置。"
        },
        {
          type: 3,
          label: "修改摘录颜色",
          key: "changeColor",
          option: ["使用 AutoStyle 的设置", "确定"],
          help: "该动作来自于 AutoStyle，与其使用相同的设置。输入颜色索引，也就是顺序，1 到 16。",
          moduleName: "AutoStyle",
          module: "autostyle"
        },
        {
          type: 2,
          label: "修改摘录样式",
          key: "changeStyle",
          option: ["使用 AutoStyle 的设置", "线框+填充", "填充", "线框"],
          moduleName: "AutoStyle",
          module: "autostyle",
          help: "该动作来自于 AutoStyle，与其使用相同的设置。"
        },
        {
          type: 2,
          key: "searchCardInfo",
          label: "搜索卡片内容",
          option: ["中文", "英文", "词典", "翻译", "学术", "问题", "其他"],
          moduleName: "CopySearch",
          module: "copysearch",
          help: "该动作来自于 CopySearch，与其使用相同的设置。"
        },
        {
          type: 2,
          key: "copyCardInfo",
          label: "复制卡片内容",
          option: ["动态选择", "优先标题", "优先摘录", "自定义"],
          moduleName: "CopySearch",
          module: "copysearch",
          help: "该动作来自于 CopySearch，与其使用相同的设置。"
        },
        {
          key: "translateCard",
          type: 2,
          label: "翻译摘录内容",
          help: "该动作来自于 AutoTranslate，与其使用相同的设置。会翻译卡片中所有的摘录，注意不要同时翻译太多内容。",
          moduleName: "AutoTranslate",
          module: "autotranslate",
          option: ["确定"]
        },
        {
          type: 3,
          label: "添加评论",
          key: "addComment",
          option: ["使用 AutoComment 的设置", "确定"],
          moduleName: "AutoComment",
          module: "autocomment",
          help: "该动作来自于 AutoComment，与其使用相同的设置。"
        },
        {
          type: 2,
          label: "转换为简体中文",
          key: "simplifyCard",
          option: ["摘录和标题", "仅摘录", "仅标题"],
          moduleName: "AutoSimplify",
          module: "autosimplify",
          help: "该动作来自于 AutoSimplify，与其使用相同的设置。"
        }
      ]
    : cardActionsEN
) as OhMyMNAction[]

export const textActions = (
  actionInChinese
    ? [
        {
          type: 2,
          key: "copyText",
          label: "复制选中文字",
          module: "magicaction4text",
          moduleName: "MagicAction For Text",
          option: ["确定"]
        },
        {
          type: 2,
          key: "searchText",
          label: "搜索选中文字",
          option: ["中文", "英文", "词典", "翻译", "学术", "问题", "其他"],
          moduleName: "CopySearch",
          module: "copysearch",
          help: "该动作来自于 CopySearch，与其使用相同的设置。"
        },
        {
          type: 2,
          key: "formulaOCR",
          label: "公式识别",
          option: ["Pure Latex", "$ Latex $", "$$ Latex $$"],
          help: '该动作来自于 AutoOCR，与其使用相同的设置。"Markdown" 插件请选择 Pure Latex',
          moduleName: "AutoOCR",
          module: "autoocr"
        },
        {
          type: 2,
          key: "textOCR",
          label: "文字识别",
          moduleName: "AutoOCR",
          module: "autoocr",
          help: "该动作来自于 AutoOCR，与其使用相同的设置。",
          option: ["确定"]
        },
        {
          type: 2,
          key: "handWrittingOCR",
          label: "手写识别",
          moduleName: "AutoOCR",
          module: "autoocr",
          help: "该动作来自于 AutoOCR，与其使用相同的设置。",
          option: ["确定"]
        },
        {
          type: 2,
          key: "QRCodeOCR",
          label: "二维码识别",
          moduleName: "AutoOCR",
          module: "autoocr",
          help: "该动作来自于 AutoOCR，与其使用相同的设置。",
          option: ["确定"]
        },
        {
          key: "translateText",
          type: 2,
          label: "翻译选中文字",
          moduleName: "AutoTranslate",
          module: "autotranslate",
          help: "该动作来自于 AutoTranslate，与其使用相同的设置。",
          option: ["确定"]
        },
        {
          type: 2,
          label: "转换为简体中文",
          key: "simplifyText",
          moduleName: "AutoSimplify",
          module: "autosimplify",
          help: "该动作来自于 AutoSimplify，与其使用相同的设置。",
          option: ["确定"]
        }
      ]
    : textActionsEN
) as OhMyMNAction[]

export const defaultRequiredCardActions = Array.from({ length: 5 }).fill({
  key: actionInChinese
    ? "false_manageProfile_0_配置管理 / 读取配置_MagicAction For Card"
    : "false_manageProfile_0_Manage Profile / Read Profile_MagicAction For Card",
  input: "",
  desc: ""
}) as CustomShortcut.Action[]

export const defaultRequiredTextActions = Array.from({ length: 5 }).fill({
  key: actionInChinese
    ? "false_copyText_0_复制选中文字 / 确定_MagicAction For Text"
    : "false_copyText_0_Copy Selected Text / Confirm_MagicAction For Text",
  input: "",
  desc: ""
}) as CustomShortcut.Action[]

export async function writeLocalShortcuts(shortcuts: LocalShortcut[]) {
  await LocalStorage.setItem(
    actionInChinese ? "local_shortcuts" : "local_shortcuts_en",
    JSON.stringify(shortcuts)
  )
}

export async function readLocalShortcuts() {
  return await LocalStorage.getItem(
    actionInChinese ? "local_shortcuts" : "local_shortcuts_en"
  )
}

export async function writeSharedShortcuts(data: {
  time: number
  info: SharedShortcut[]
}) {
  await LocalStorage.setItem(
    actionInChinese ? "shared_shortcuts" : "shared_shortcuts_en",
    JSON.stringify(data)
  )
}

export async function readSharedShortcuts() {
  return await LocalStorage.getItem(
    actionInChinese ? "shared_shortcuts" : "shared_shortcuts_en"
  )
}
