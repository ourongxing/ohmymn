import zh from "./zh"
import en from "./en"
import { Addon } from "~/addon"
export type Dict = typeof zh
const lang = Addon.isZH ? zh : en
export default lang
