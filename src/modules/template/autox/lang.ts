import { MN } from "const"

const zh = {
  intro: "",
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
