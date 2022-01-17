import zh from "./zh"
import en from "./en"
export type Dict = typeof zh
const isZH =
  NSLocale.preferredLanguages().length &&
  NSLocale.preferredLanguages()[0].startsWith("zh")
const lang = isZH ? zh : en
export default lang
