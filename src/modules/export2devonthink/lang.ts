import { MN } from "@/const"

const zh = {
  intro: "导出卡片信息到其他支持URLScheme的应用",
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
