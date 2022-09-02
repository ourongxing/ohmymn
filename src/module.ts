import { ISection } from "./typings"
import { CellViewType } from "./typings/enum"
import anotherautotitle from "./modules/anotherautotitle"
import autocomment from "./modules/autocomment"
import autocomplete from "./modules/autocomplete"
import autolist from "./modules/autolist"
import autoocr from "./modules/autoocr"
import autoreplace from "./modules/autoreplace"
import autoformat from "./modules/autoformat"
import autostyle from "./modules/autostyle"
import autotag from "./modules/autotag"
import autotranslate from "./modules/autotranslate"
import copysearch from "./modules/copysearch"
import gesture from "./modules/gesture"
import magicaction4card from "./modules/magicaction4card"
import magicaction4text from "./modules/magicaction4text"
import addon from "./modules/addon"
import anotherautodef from "./modules/anotherautodef"
import { MN } from "./const"

export const modules = {
  gesture,
  anotherautotitle,
  anotherautodef,
  autoformat,
  autocomplete,
  autoreplace,
  autolist,
  autotag,
  autostyle,
  copysearch,
  autoocr,
  autotranslate,
  autocomment
}

export const constModules = { addon, magicaction4card, magicaction4text }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: `OhMyMN ${MN.isZH ? "官网：" : "Website: "}ohmymn.marginnote.cn`,
      link: "https://ohmymn.vercel.app"
    },
    {
      type: CellViewType.PlainText,
      label: `${MN.isZH ? "核心开发团队：" : "Core Team: "}ourongxing，Bryan`,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: MN.isZH
        ? "OhMyMN 是 MarginNote 插件控制面板及开发框架。OhMyMN 完全开源，官方支持，欢迎参与。"
        : "OhMyMN is MarginNote addon control panel and development framework.OhMyMN is completely open source, officially supported, welcome to join.",
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
