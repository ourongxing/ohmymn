import zh from "./zh"
import en from "./en"
import { MN } from "~/const"
export type Dict = typeof zh
const lang = MN.isZH ? zh : en
export default lang
