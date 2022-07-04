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
      label: "OhMyMN 官网：ohmymn.vercel.app",
      link: "https://ohmymn.vercel.app"
    },
    {
      type: CellViewType.PlainText,
      label: "核心开发团队：ourongxing，Bryan",
      link: ""
    },
    {
      type: CellViewType.PlainText,
      label: "OhMyMN 完全开源，官方支持，欢迎参与开发。",
      link: ""
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
