import { MN } from "./const"
import { ReplaceParam } from "./utils/input"

const globalProfilePreset = {
  addon: {
    quickSwitch: [],
    lockExcerpt: false,
    screenAlwaysOn: false,
    hasTitleThen: [1],
    removeExcerpt: [1],
    panelControl: [],
    panelPosition: [0],
    panelHeight: [1],
    autoBackup: false,
    showDocInfo: false
  },
  magicaction4card: {
    smartSelection: false,
    defaultMergeText: "\\n"
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
    customFill:
      "{{#phonetic}}🔈[{{phonetic}}] {{/phonetic}}{{collins}}\n{{zh}}{{#tags}}\n🏷 {{tags}}{{/tags}}",
    selectMeaning: false,
    autoContext: false,
    translateContext: false
  },
  autoformat: {
    on: false,
    preset: [],
    customFormat: "",
    formatTitle: false
  },
  anotherautotitle: {
    on: false,
    preset: [],
    changeTitleNoLimit: false,
    wordCount: "[10, 5]",
    customBeTitle: ""
  },
  anotherautodef: {
    on: false,
    preset: [],
    onlyDesc: false,
    toTitleLink: false,
    titleLinkSplit: [1],
    customTitleSplit: "",
    customDefLink: "",
    customExtractTitle: ""
  },
  autolist: {
    on: false,
    preset: [],
    customList: ""
  },
  autoreplace: {
    on: false,
    preset: [],
    customReplace: ""
  },
  autotag: {
    on: false,
    preset: [],
    customTag: ""
  },
  autocomment: {
    on: false,
    preset: [],
    citation: `(/^.*$/gs, "{{doc.author}} ( {{doc.publicationDate}} ) {{doc.title}}.{{doc.publisher}}, {{doc.publicationPlace}}.P{{page.real.start}}{{#page.real.end}}-P{{page.real.end}}{{/page.real.end}}", 1)`,
    customComment: ""
  },
  autostyle: {
    on: false,
    preset: [],
    wordCountArea: "[10, 5, 10]",
    showArea: false,
    defaultTextExcerptColor: [0],
    defaultPicExcerptColor: [0],
    defaultTextExcerptStyle: [0],
    defaultPicExcerptStyle: [0]
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
    searchWord: "eudic://dict/{{keyword}}",
    searchTranslation: "https://www.deepl.com/zh/translator#en/zh/{{keyword}}",
    searchOtherText: ""
  },
  autoocr: {
    baiduSecretKey: "",
    baiduApiKey: "",
    lang: [0],
    formulaOCRProviders: [0],
    mathpixAppKey: "",
    showKey: true
  },
  autotranslate: {
    on: false,
    wordCount: "[10, 5]",
    baiduSecretKey: "",
    baiduAppID: "",
    baiduThesaurus: false,
    baiduAdvance: false,
    translateProviders: [0],
    caiyunToken: "",
    showKey: true,
    autoCopy: false,
    hudTime: "3",
    baiduFromLang: [0],
    caiyunFromLang: [0],
    baiduToLang: [0],
    caiyunToLang: [0]
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
    jumpBack: true,
    allowRepeat: true,
    addTags: [0],
    autoSync: [0],
    tagTemplate: "{{#tags}}#{{.}} {{/tags}}#{{notebook.title}} #MarginNote",
    showTemplate: [1],
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
  export2devonthink: {
    exportMethod: [0],
    showTemplate: true,
    title: "{{notebook.title}}",
    comment: "",
    addTags: [0],
    tags: "{{#tags}}{{.}},{{/tags}},{{notebook.title}},MarginNote",
    destination: "",
    htmlsource: "",
    pdfsource: "",
    mdtext: "{{allText}}",
    txtext: "{{allText}}",
    hide: "",
    referrer: "",
    width: "",
    paginated: ""
  },
  additional: {
    backupID: "",
    autoocr: {
      lastGetToken: 0,
      baiduToken: ""
    }
  }
}

// Each document has a independent profile
const docProfilePreset = {
  addon: {
    pageOffset: "0",
    author: "",
    publisher: "",
    publicationDate: "",
    publicationPlace: "",
    type: "",
    otherInfo: ""
  },
  magicaction4text: {
    preOCR: false
  },
  autoocr: {
    on: false,
    lang: [0]
  }
}

const notebookProfilePreset = {
  addon: {
    profile: [0]
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
    cacheTitle: {} as Record<string, [string, string, string][]>,
    cacheComment: {} as Record<string, [string, string, string][]>
  }
}

// Cache Regex like [//,//];[//,//] 和 (//,"",0);(//,"",0);
const tempProfilePreset = {
  replaceParam: {
    customTag: [],
    customComment: [],
    customList: [],
    customReplace: [],
    customExtractTitle: [],
    customFormat: []
  },
  regArray: {
    customTitleSplit: [],
    customBeTitle: [],
    customDefLink: []
  }
}

type UtilTemp<T> = {
  [K in keyof T]: K extends "replaceParam"
    ? {
        [M in keyof T[K]]: ReplaceParam[] | undefined
      }
    : {
        [M in keyof T[K]]: RegExp[][] | undefined
      }
}

type UtilProfile<T> = {
  [K in keyof T]: K extends "additional"
    ? T[K]
    : {
        [M in keyof T[K]]: T[K][M] extends any[] ? number[] : T[K][M]
      }
}

type ITempProfile = UtilTemp<typeof tempProfilePreset>
type IGlobalProfile = UtilProfile<typeof globalProfilePreset>
type IDocProfile = UtilProfile<typeof docProfilePreset>
type INotebookProfile = UtilProfile<typeof notebookProfilePreset>
type IAllProfile = IGlobalProfile & IDocProfile & INotebookProfile

export {
  globalProfilePreset,
  docProfilePreset,
  tempProfilePreset,
  notebookProfilePreset,
  IGlobalProfile,
  IDocProfile,
  INotebookProfile,
  ITempProfile,
  IAllProfile
}
