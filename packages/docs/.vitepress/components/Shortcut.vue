<script lang="ts" setup>
import { watchEffect, reactive } from 'vue';
import { ElPopover, ElButton, ElCascader, ElInputNumber, ElRadio, ElRadioGroup, ElInput, CascaderValue } from "element-plus"


const cardActions = [
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
    moduleName: "MagicAction For Card"
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
    module: "autotranslate"
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
  },
  {
    type: 3,
    label: "基于卡片回答",
    key: "answerWithCard",
    moduleName: "AI",
    module: "ai",
    help: "该动作来自于 AI，与其使用相同的设置。"
  },
]

const textActions = [{
  type: 2,
  key: "copyText",
  label: "复制选中文字",
  module: "magicaction4text",
  moduleName: "MagicAction For Text"
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
  help: "该动作来自于 AutoOCR，与其使用相同的设置。"
},
{
  type: 2,
  key: "handWrittingOCR",
  label: "手写识别",
  moduleName: "AutoOCR",
  module: "autoocr",
  help: "该动作来自于 AutoOCR，与其使用相同的设置。"
},
{
  type: 2,
  key: "QRCodeOCR",
  label: "二维码识别",
  moduleName: "AutoOCR",
  module: "autoocr",
  help: "该动作来自于 AutoOCR，与其使用相同的设置。"
},
{
  key: "translateText",
  type: 2,
  label: "翻译选中文字",
  moduleName: "AutoTranslate",
  module: "autotranslate",
  help: "该动作来自于 AutoTranslate，与其使用相同的设置。"
},
{
  type: 2,
  label: "转换为简体中文",
  key: "simplifyText",
  moduleName: "AutoSimplify",
  module: "autosimplify",
  help: "该动作来自于 AutoSimplify，与其使用相同的设置。"
}
]

const cardOptions = cardActions.map(k => {
  if (!k?.option?.length)
    k.option = ["确定"]
  return {
    value: k.key,
    label: k.label,
    children: k.option.map((o, i) => {
      return {
        value: `${k.type === 3 && !/使用.*的设置/.test(o)}-${i}`,
        label: o,
      }
    }
    )
  }
})

const textOptions = textActions.map(k => {
  if (!k?.option?.length)
    k.option = ["确定"]
  return {
    value: k.key,
    label: k.label,
    children: k.option.map((o, i) => {
      return {
        value: `${k.type === 3 && !/使用.*的设置/.test(o)}-${i}`,
        label: o,
      }
    }
    )
  }
})

interface Selection {
  action: string
  type: "text" | "card"
  label: string
  option: string
  input?: boolean
  content?: string
}

const state = reactive({
  num: 1,
  type: "card" as "text" | "card",
  options: cardOptions,
  selections: [] as Selection[],
  error: false
})

watchEffect(() => {
  state.options = state.type === "card" ? cardOptions : textOptions
  state.selections = []
  state.num = 1
})

watchEffect(() => {
  if (state.num > state.selections.length) {
    for (let i = state.selections.length; i < state.num; i++)
      state.selections.push({
        action: "",
        type: state.type,
        label: "",
        option: "",
        input: false,
        content: ""
      })
  } else if (state.num < state.selections.length) {
    for (let i = state.selections.length; i > state.num; i--)
      state.selections.pop()
  }
})

watchEffect(() => {
  const status = !state.selections.every(k => k.action && (!k.input || (k.input && k.content)))
  state.error = status
})

function handleSelect(val: CascaderValue, selection: Selection) {
  if (val) {
    // @ts-ignore
    const [action, extra] = val
    const [input, option] = extra.split("-")
    selection.action = action
    selection.input = input === "true"
    selection.option = option
  } else {
    selection.action = ""
    selection.input = false
    selection.option = ""
    selection.content = ""
  }
}


function genShortcut() {
  const actions = state.selections.map(k => {
    if (k.input && k.content)
      return {
        action: k.action,
        type: k.type,
        option: k.option,
        content: k.content.replace(/\n/g, "\\n"),
      }
    else return {
      action: k.action,
      type: k.type,
      option: k.option,
      content: ""
    }
  })
  const shortcut = `marginnote3app://addon/ohmymn?actions=${encodeURIComponent(JSON.stringify(actions))}`
  copyToClipboard(shortcut)
}

async function copyToClipboard(text: string) {
  if (!text) return
  try {
    return await navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement("textarea")
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute("readonly", "")

    element.style.contain = "strict"
    element.style.position = "absolute"
    element.style.left = "-9999px"
    element.style.fontSize = "12pt" // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand("copy")
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ; (previouslyFocusedElement as HTMLElement).focus()
    }
  }
}
</script>

<template>
  <client-only>
    <div class="my-2">
      <el-radio-group v-model="state.type">
        <el-radio label="card" border>卡片动作</el-radio>
        <el-radio label="text" border>文字动作</el-radio>
      </el-radio-group>
    </div>
    <div class="flex justify-between itmes-center my-2">
      <el-input-number v-model="state.num" :min="1" :max="10" />
      <el-popover placement="top-end" trigger="click" content="复制成功">
        <template #reference>
          <el-button plain @click="genShortcut" :disabled="state.error">生成并复制</el-button>
        </template>
      </el-popover>
    </div>
    <hr />
    <div v-for="(selection, i) in state.selections">
      <div class="text-sm my-2"> 动作 {{ i + 1 }} </div>
      <el-cascader placeholder="请选择" :options="state.options" clearable filterable
        @change="(val) => handleSelect(val, selection)" class="w-full" />
      <el-input class="mt-2" v-show="selection.input" v-model:model-value="selection.content" autosize type="textarea"
        placeholder="当前动作需要输入值" clearable />
    </div>
  </client-only>
</template>
