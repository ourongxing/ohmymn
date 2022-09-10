import { ISection } from "~/typings"
import { CellViewType } from "~/enum"
import anotherautotitle from ".//anotherautotitle"
import autocomment from "./autocomment"
import autocomplete from "./autocomplete"
import autolist from "./autolist"
import autoocr from "./autoocr"
import autoreplace from "./autoreplace"
import autoformat from "./autoformat"
import autostyle from "./autostyle"
import autotag from "./autotag"
import autotranslate from "./autotranslate"
import copysearch from "./copysearch"
import gesture from "./gesture"
import magicaction4card from "./magicaction4card"
import magicaction4text from "./magicaction4text"
import addon from "./addon"
import anotherautodef from "./anotherautodef"
import autosimplify from "./autosimplify"
import { MN } from "~/sdk"

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
  autocomment,
  autosimplify
}

export const constModules = { addon, magicaction4card, magicaction4text }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: `OhMyMN ${MN.isZH ? "官网：" : "Website: "}ohmymn.marginnote.cn`,
      link: "https://ohmymn.marginnote.cn"
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
