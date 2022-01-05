import { AutoTitlePreset, HasTitleThen } from "addons/anotherautotitle"
import { AutoListPreset } from "addons/autolist"
import { AutoReplacePreset } from "addons/autoreplace"
import { AutoStandardizePreset } from "addons/autostandardize"
import { AutoTagPreset } from "addons/autotag"
import { PanelHeight, PanelPosition } from "addons/ohmymn"
import { QuickSwitch } from "synthesizer"

const profilePreset = {
  ohmymn: {
    quickSwitch: [] as QuickSwitch[],
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    screenAlwaysOn: false,
    panelPosition: [PanelPosition.Auto],
    panelHeight: [PanelHeight.Standard]
  },
  gesture: {
    // 单选不允许为空，一般设置一个选项为空
    singleBarSwipeUp: [0],
    singleBarSwipeDown: [0],
    singleBarSwipeRight: [0],
    singleBarSwipeLeft: [0],
    muiltBarSwipeUp: [0],
    muiltBarSwipeDown: [0],
    muiltBarSwipeRight: [0],
    muiltBarSwipeLeft: [0]
  },
  autocomplete: {
    customComplete: `"{{zh}}"`
  },
  autostandardize: {
    preset: [] as AutoStandardizePreset[]
  },
  anotherautotitle: {
    preset: [] as AutoTitlePreset[],
    hasTitleThen: [HasTitleThen.ExpertText],
    changeTitleNoLimit: false,
    wordCount: "[10,5]",
    customBeTitle: ""
  },
  anotherautodef: {
    preset: [] as number[],
    onlyDesc: false,
    toTitleLink: false,
    customSplit: "",
    customSplitName: "",
    customDefTitle: ""
  },
  autolist: {
    preset: [] as AutoListPreset[],
    customList: ""
  },
  autoreplace: {
    preset: [] as AutoReplacePreset[],
    customReplace: ""
  },
  autotag: {
    preset: [] as AutoTagPreset[],
    customTag: ""
  }
}

const docProfilePreset = {
  ohmymn: {
    profile: [0],
    autoCorrect: false
  }
}

type IProfile = typeof profilePreset
type IDocProfile = typeof docProfilePreset

const profile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile = JSON.parse(JSON.stringify(profilePreset))
const docProfile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IDocProfile = JSON.parse(JSON.stringify(docProfilePreset))

export {
  profile,
  profilePreset,
  docProfile,
  docProfilePreset,
  IProfile,
  IDocProfile
}
