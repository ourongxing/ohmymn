import { MN } from "@/const"

const zh = {
  intro:
    "所有动作均需要在文档中选中文字或框选选区。点击查看具体的使用方法和注意事项。",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  help: {
    preOCR: "【当前文档】使用 AutoOCR 进行转文字"
  },
  label: {
    preOCR: "预先 OCR"
  }
}

const en: typeof zh = {
  intro:
    "All actions need to select text or area fisrt in the document. Click for the specific useage.",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  help: {
    preOCR: "[Current Document] Use AutoOCR to convert text."
  },
  label: {
    preOCR: "Pre OCR"
  }
}

export const lang = MN.isZH ? zh : en
