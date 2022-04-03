import { MN } from "const"

const zh = {
  intro: "",
  link: "",
  label: {},
  option: {},
  help: {}
}

const en: typeof zh = {
  intro: "",
  link: "",
  label: {},
  option: {},
  help: {}
}

export const lang = MN.isZH ? zh : en
