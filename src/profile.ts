import {
  PanelHeight,
  PanelPosition,
  HasTitleThen,
  PanelControl
} from "modules/ohmymn"
import { AutoTitlePreset } from "modules/anotherautotitle"
import { AutoListPreset } from "modules/autolist"
import { AutoReplacePreset } from "modules/autoreplace"
import { AutoStandardizePreset } from "modules/autostandardize"
import { AutoStylePreset } from "modules/autostyle"
import { AutoTagPreset } from "modules/autotag"
import { QuickSwitch } from "synthesizer"
import { ReplaceParam } from "utils/input"
import { TitleLinkSplit } from "modules/anotherautodef"
import { FillWordInfo } from "modules/autocomplete"

const profilePreset = {
  ohmymn: {
    quickSwitch: [] as QuickSwitch[],
    lockExcerpt: false,
    screenAlwaysOn: false,
    hasTitleThen: [HasTitleThen.ExpertText],
    panelControl: [] as PanelControl[],
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
    fillWordInfo: [FillWordInfo.None],
    customFill: "{{zh}}"
  },
  autostandardize: {
    preset: [] as AutoStandardizePreset[],
    customStandardize: "",
    standardizeTitle: false
  },
  anotherautotitle: {
    preset: [] as AutoTitlePreset[],
    changeTitleNoLimit: false,
    wordCount: "[10, 5]",
    customBeTitle: ""
  },
  anotherautodef: {
    preset: [] as number[],
    onlyDesc: false,
    toTitleLink: false,
    titleLinkSplit: [TitleLinkSplit.Default],
    customTitleSplit: "",
    customDefLink: "",
    customExtractTitle: ""
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
  },
  autostyle: {
    preset: [] as AutoStylePreset[],
    wordCountArea: "[10, 5, 10]",
    showArea: false,
    defaultTextExcerptColor: [0],
    defaultPicExcerptColor: [0],
    defaultTextExcerptStyle: [0],
    defaultPicExcerptStyle: [0]
  }
}

const docProfilePreset = {
  ohmymn: {
    profile: [0],
    autoCorrect: false
  }
}

// 感觉转换这么复杂，每次使用的时候都需要转换，有点浪费，应该在读配置的时候预先缓存
// 主要还是 [//,//];[//,//] 和 (//,"",0);(//,"",0);
const profileTempPreset = {
  replaceParam: {
    customTag: [{}] as ReplaceParam[] | undefined,
    customList: [{}] as ReplaceParam[] | undefined,
    customReplace: [{}] as ReplaceParam[] | undefined,
    customExtractTitle: [{}] as ReplaceParam[] | undefined,
    customStandardize: [{}] as ReplaceParam[] | undefined
  },
  regArray: {
    customTitleSplit: [[]] as RegExp[][] | undefined,
    customBeTitle: [[]] as RegExp[][] | undefined,
    customDefLink: [[]] as RegExp[][] | undefined
  }
}

type IProfileTemp = typeof profileTempPreset
type IProfile = typeof profilePreset
type IDocProfile = typeof docProfilePreset

export {
  profilePreset,
  docProfilePreset,
  profileTempPreset,
  IProfile,
  IDocProfile,
  IProfileTemp
}
