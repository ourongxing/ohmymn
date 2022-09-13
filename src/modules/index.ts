import { ISection } from "~/typings"
import { CellViewType } from "~/enum"
import addon from "./addon"
import gesture from "./gesture"
import magicaction4card from "./magicaction4card"
import magicaction4text from "./magicaction4text"
import anotherautodef from "./anotherautodef"
import anotherautotitle from "./anotherautotitle"
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
import autosimplify from "./autosimplify"
import lang from "~/lang"

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
      label: lang.more.website,
      link: "https://ohmymn.marginnote.cn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.more.core_team,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.more.intro,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
