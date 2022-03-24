import { MN } from "const"

const zh = {
  intro:
    "所有动作均需要在文档中选中文字或框选选区。点击查看所有动作具体的使用方法和注意事项",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  help: {
    preOCR: "【当前文档生效】"
  },
  label: {
    preOCR: "预先 OCR"
  }
}

const en: typeof zh = {
  intro:
    "All actions require text to be selected or a selection to be drawn in the document. Click to see the specific usage and notes for all actions.",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  help: {
    preOCR: "[Current Doc Takes Effect]"
  },
  label: {
    preOCR: "Pre OCR"
  }
}

export const lang = MN.isZH ? zh : en
