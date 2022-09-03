import { Addon } from "~/addon"

const zh = {
  intro:
    "所有动作均需要在文档中选中文字或框选选区。点击查看具体的使用方法和注意事项。",
  link: "https://ohmymn.vercel.app/guide/modules/magicaction4text.html",
  help: {
    preOCR:
      "【当前文档】使用 AutoOCR 进行转文字和矫正，请确保你已经填入 OCR 密钥。"
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
    preOCR:
      "【当前文档】使用 AutoOCR 进行转文字和矫正，请确保你已经填入 OCR 密钥。"
  },
  label: {
    preOCR: "Pre OCR"
  }
}

export const lang = Addon.isZH ? zh : en
