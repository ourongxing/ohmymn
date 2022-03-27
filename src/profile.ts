import { MN } from "const"
import { ReplaceParam } from "utils/input"

const profilePreset = {
  addon: {
    quickSwitch: [] as number[],
    lockExcerpt: false,
    screenAlwaysOn: false,
    // Single select is not allowed to be empty, generally set an option to none
    hasTitleThen: [0],
    panelControl: [] as number[],
    panelPosition: [0],
    panelHeight: [1]
  },
  gesture: {
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
    whichPartofCard: [0],
    searchChineseText: "https://www.bing.com/search?q={{keyword}}&ensearch=0",
    searchEnglishText: "https://www.bing.com/search?q={{keyword}}&ensearch=1",
    searchAcademic: "https://scholar.google.com.hk/scholar?q={{keyword}}",
    searchQuestion: "https://www.zhihu.com/search?q={{keyword}}",
    searchOtherText: ""
  },
  autoocr: {
    baiduSecretKey: "",
    baiduApiKey: "",
    formulaOCRProviders: [0],
    mathpixAppKey: "",
    showKey: true
  },
  autotranslate: {
    on: false,
    baiduSecretKey: "",
    baiduAppID: "",
    baiduThesaurus: false,
    baiduAdvance: false,
    translateProviders: [0],
    caiyunToken: "",
    showKey: true,
    outFormat: [1],
    hudTime: "3"
  },
  export2flomo: {
    exportMethod: [1],
    flomoAPI: "",
    exportContent: "",
    templateFlomo: [0],
    showTemplate: true,
    addTags: [0],
    tagTemplate: "{{#tags}}#{{.}} {{/tags}}#{{notebook.title}} #MarginNote",
    flomoTemplate1: "{{excerpts.ocr.0}}",
    flomoTemplate2: "",
    flomoTemplate3: ""
  },
  export2anki: {
    exportMethod: [1],
    ankiConnectAPI: "",
    profileName: MN.isZH ? "账户1" : "User 1",
    addTags: [0],
    autoSync:[0],
    tagTemplate: "{{#tags}}#{{.}} {{/tags}}#{{notebook.title}} #MarginNote",
    showTemplate: [0],
    modelName1: "",
    field11: "",
    field12: "",
    field13: "",
    field14: "",
    field15: "",
    field16: "",
    field17: "",
    field18: "",
    field19: "",
    modelName2: "",
    field21: "",
    field22: "",
    field23: "",
    field24: "",
    field25: "",
    field26: "",
    field27: "",
    field28: "",
    field29: "",
    modelName3: "",
    field31: "",
    field32: "",
    field33: "",
    field34: "",
    field35: "",
    field36: "",
    field37: "",
    field38: "",
    field39: ""
  },
  additional: {
    autoocr: {
      lastGetToken: 0,
      baiduToken: ""
    }
  }
}

// Each document has a independent profile
const docProfilePreset = {
  addon: {
    profile: [0]
  },
  autoocr: {
    on: false,
    lang: [0]
  },
  magicaction4text: {
    preOCR: false
  },
  autotranslate: {
    baiduFromLang: [0],
    caiyunFromLang: [0],
    baiduToLang: [0],
    caiyunToLang: [0]
  },
  copysearch: {
    searchWord: "eudic://dict/{{keyword}}",
    searchTranslation: "https://www.deepl.com/zh/translator#en/zh/{{keyword}}"
  },
  export2anki: {
    deckName: "{{notebook.title}}",
    defaultTemplate: [0]
  },
  export2flomo: {
    defaultTemplate: [0]
  },
  // Information not displayed on the UI
  additional: {
    lastExcerpt: 0,
    cacheExcerptTitle: {} as {
      [noteid: string]: string[] | undefined
    }
  }
}

// Cache Regex like [//,//];[//,//] 和 (//,"",0);(//,"",0);
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
