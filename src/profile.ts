import { ReplaceParam } from "utils/input"

const profilePreset = {
  addon: {
    quickSwitch: [] as number[],
    lockExcerpt: false,
    screenAlwaysOn: false,
    hasTitleThen: [0],
    panelControl: [] as number[],
    panelPosition: [0],
    panelHeight: [1]
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
    muiltBarSwipeLeft: [0],
    selectionBarSwipeUp: [0],
    selectionBarSwipeDown: [0],
    selectionBarSwipeRight: [0],
    selectionBarSwipeLeft: [0]
  },
  autocomplete: {
    on: false,
    fillWordInfo: [0],
    customFill: "{{zh}}"
  },
  autostandardize: {
    on: false,
    preset: [] as number[],
    customStandardize: "",
    standardizeTitle: false
  },
  anotherautotitle: {
    on: false,
    preset: [] as number[],
    changeTitleNoLimit: false,
    wordCount: "[10, 5]",
    customBeTitle: ""
  },
  anotherautodef: {
    on: false,
    preset: [] as number[],
    onlyDesc: false,
    toTitleLink: false,
    titleLinkSplit: [0],
    customTitleSplit: "",
    customDefLink: "",
    customExtractTitle: ""
  },
  autolist: {
    on: false,
    preset: [] as number[],
    customList: ""
  },
  autoreplace: {
    on: false,
    preset: [] as number[],
    customReplace: ""
  },
  autotag: {
    on: false,
    preset: [] as number[],
    customTag: ""
  },
  autostyle: {
    on: false,
    preset: [] as number[],
    wordCountArea: "[10, 5, 10]",
    showArea: false,
    defaultTextExcerptColor: [0],
    defaultPicExcerptColor: [0],
    defaultTextExcerptStyle: [0],
    defaultPicExcerptStyle: [0]
  },
  magicaction4card: {
    smartSelection: false
  },
  copysearch: {
    multipleTitles: [0],
    multipleExcerpts: [0],
    customContent: "[{{title}}]({{link}})",
    showSearchEngine: false,
    separatorSymbols: "\\n\\n",
    whichSearchEngine: [0],
    searchChineseText: "https://www.bing.com/search?q={{keyword}}&ensearch=0",
    searchEnglishText: "https://www.bing.com/search?q={{keyword}}&ensearch=1",
    searchWord: "eudic://dict/{{keyword}}",
    searchTranslation: "https://www.deepl.com/zh/translator#en/zh/{{keyword}}",
    searchAcademic: "https://scholar.google.com.hk/scholar?q={{keyword}}",
    searchQuestion: "https://www.zhihu.com/search?q={{keyword}}",
    searchOtherText: ""
  },
  autoocr: {
    apiKey: "ImL4X1uCXDlt5piVeFIT6peo",
    secretKey: "xEHxQpBpXLrEVSN9hFScZszS5X0cN639",
    showKey: true
  },
  // 不显示在 UI 上的配置信息
  additional: {
    autoocr: {
      lastGetToken: 0,
      baiduToken: ""
    }
  }
}

const docProfilePreset = {
  addon: {
    profile: [0]
  },
  autoocr: {
    on: false,
    lang: [0]
  },
  // 不显示在 UI 上的配置信息
  additional: {
    lastExcerpt: 0,
    cacheExcerptTitle: {} as {
      [noteid: string]: string[] | undefined
    }
  }
}

// 感觉转换这么复杂，每次使用的时候都需要转换，有点浪费，应该在读配置的时候预先缓存
// 主要还是 [//,//];[//,//] 和 (//,"",0);(//,"",0);
const profileTempPreset = {
  replaceParam: {
    customTag: [] as ReplaceParam[] | undefined,
    customList: [] as ReplaceParam[] | undefined,
    customReplace: [] as ReplaceParam[] | undefined,
    customExtractTitle: [] as ReplaceParam[] | undefined,
    customStandardize: [] as ReplaceParam[] | undefined
  },
  regArray: {
    customTitleSplit: [] as RegExp[][] | undefined,
    customBeTitle: [] as RegExp[][] | undefined,
    customDefLink: [] as RegExp[][] | undefined
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
