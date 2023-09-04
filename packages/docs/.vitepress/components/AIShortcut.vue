<script lang="ts" setup>
import { ElPopover, ElButton, ElInputNumber, ElRadio, ElRadioGroup } from "element-plus"
import { reactive } from "vue"


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

const state = reactive({
  type: "card",
  num: 0,
})

async function genShortcut() {
  const card = `marginnote3app://addon/ohmymn?actions=%5B%7B%22action%22%3A%22aiActionPrompts%22%2C%22type%22%3A%22card%22%2C%22option%22%3A%22🙂%22%2C%22content%22%3A%22%22%7D%5D`
  const text = `marginnote3app://addon/ohmymn?actions=%5B%7B%22action%22%3A%22aiActionPromptsText%22%2C%22type%22%3A%22text%22%2C%22option%22%3A%22🙂%22%2C%22content%22%3A%22%22%7D%5D`
  if (state.type === "text")
    await copyToClipboard(text.replace("🙂", String(state.num)))
  else
    await copyToClipboard(card.replace("🙂", String(state.num)))
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
      <el-input-number v-model="state.num" :min="0" :max="100" />
      <el-popover placement="top-end" trigger="click" content="复制成功">
        <template #reference>
          <el-button plain @click="genShortcut">生成并复制</el-button>
        </template>
      </el-popover>
    </div>
    <hr />
  </client-only>
</template>
