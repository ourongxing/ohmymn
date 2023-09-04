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
import shortcut from "./shortcut"
import ai from "./ai"
import toolbar from "./toolbar"

export const optionalModules = {
  shortcut,
  gesture,
  toolbar,
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
  autosimplify,
  ai
}

export const requiredModules = { addon, magicaction4card, magicaction4text }
