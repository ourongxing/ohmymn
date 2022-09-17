import { MN } from "~/sdk"

const zh = {
  intro:
    "所有动作均需要在文档中选中文字或框选选区。点击查看具体的使用方法和注意事项。",
  pre_OCR: {
    label: "预先 OCR",
    help: "【当前文档】使用 AutoOCR 进行转文字和矫正，请确保你已经填入 OCR 密钥。"
  },
  pre_simplify: {
    label: "预先转为简体中文",
    help: "【当前文档】使用 AutoSimplify 进行繁简转换"
  },
  note_options: {
    $option6: [
      "复制",
      "设置为标题",
      "合并标题",
      "合并到摘录",
      "设置为摘录",
      "设置为评论"
    ] as StringTuple<6>,
    label: "弹出更多选项",
    help: "如果选中这段文字或区域之前，你已经选中了一段摘录的笔记。此时复制到剪贴板的动作会弹出更多选项，方便直接写入卡片中。"
  }
}

const en: typeof zh = {
  intro:
    "All actions need to select text or area fisrt in the document. Click for the specific useage.",
  pre_OCR: {
    label: "Pre OCR",
    help: "[Current Document] Use AutoOCR to OCR. Please make sure you have filled in the OCR key."
  },
  pre_simplify: {
    label: "Pre Simplify",
    help: "[Current Document] Use AutoSimplify to convert to Simplified Chinese."
  },
  note_options: {
    $option6: [
      "Copy",
      "Set as Title",
      "Merge Title",
      "Merge to Note",
      "Set as Note",
      "Set as Comment"
    ],
    label: "More Options",
    help: "If you have selected a note before selecting this text or area, the copy action will pop up more options to write directly into the card."
  }
}

export const lang = MN.isZH ? zh : en
