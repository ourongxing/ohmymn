import { MN } from "@/const"

const zh = {
  intro: "导出到 Flomo。建议使用 API 导入。",
  link: "",
  lable: {},
  option: {},
  help: {}
}
const en: typeof zh = {
  intro: "",
  link: "",
  lable: {},
  option: {},
  help: {}
}

export const lang = MN.isZH ? zh : en
