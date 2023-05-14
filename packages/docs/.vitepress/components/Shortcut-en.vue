<script lang="ts" setup>
import { watchEffect, reactive } from 'vue';
import { ElPopover, ElButton, ElCascader, ElInputNumber, ElRadio, ElRadioGroup, ElInput, CascaderValue } from "element-plus"

const cardActions = [{
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
  moduleName: "MagicAction For Card"
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
  module: "autotranslate"
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
},
{
  type: 3,
  label: "Answer with Card",
  key: "answerWithCard",
  moduleName: "AI",
  module: "ai",
  help: "This action comes from AI and uses the same settings. "
},
]
const textActions = [
  {
    type: 2,
    key: "copyText",
    label: "Copy Selected Text",
    module: "magicaction4text",
    moduleName: "MagicAction For Text"
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
    help: "This action comes from AutoOCR and uses the same settings. "
  },
  {
    type: 2,
    key: "handWrittingOCR",
    label: "Handwritting OCR",
    moduleName: "AutoOCR",
    module: "autoocr",
    help: "This action comes from AutoOCR and uses the same settings. "
  },
  {
    type: 2,
    key: "QRCodeOCR",
    label: "QRCode OCR",
    moduleName: "AutoOCR",
    module: "autoocr",
    help: "This action comes from AutoOCR and uses the same settings. "
  },
  {
    key: "translateText",
    type: 2,
    label: "Translate Selected Text",
    moduleName: "AutoTranslate",
    module: "autotranslate",
    help: "This action comes from AutoTranslate and uses the same settings. "
  },
  {
    type: 2,
    label: "Convert to Simplified Chinese",
    key: "simplifyText",
    moduleName: "AutoSimplify",
    module: "autosimplify",
    help: "This action comes from AutoSimplify and uses the same settings. "
  }
]

const cardOptions = cardActions.map(k => {
  if (!k?.option?.length)
    k.option = ["Confirm"]
  return {
    value: k.key,
    label: k.label,
    children: k.option.map((o, i) => {
      return {
        value: `${k.type === 3 && !/Use.*Settings/.test(o)}-${i}`,
        label: o,
      }
    }
    )
  }
})

const textOptions = textActions.map(k => {
  if (!k?.option?.length)
    k.option = ["Confirm"]
  return {
    value: k.key,
    label: k.label,
    children: k.option.map((o, i) => {
      return {
        value: `${k.type === 3 && !/Use.*Settings/.test(o)}-${i}`,
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
        <el-radio label="card" border>Card Action</el-radio>
        <el-radio label="text" border>Text Action</el-radio>
      </el-radio-group>
    </div>
    <div class="flex justify-between itmes-center my-2">
      <el-input-number v-model="state.num" :min="1" :max="10" />
      <el-popover placement="top-end" trigger="click" content="Copied Successfully" :width="180">
        <template #reference>
          <el-button plain @click="genShortcut" :disabled="state.error">Generate & Copy</el-button>
        </template>
      </el-popover>
    </div>
    <hr />
    <div v-for="(selection, i) in state.selections">
      <div class="text-sm my-2"> Action {{ i + 1 }} </div>
      <el-cascader placeholder="Select" :options="state.options" clearable filterable
        @change="(val) => handleSelect(val, selection)" class="w-full" />
      <el-input class="mt-2" v-show="selection.input" v-model:model-value="selection.content" autosize type="textarea"
        placeholder="The current action requires an input value" clearable />
    </div>
  </client-only>
</template>
