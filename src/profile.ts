import { MN } from "const"
import { ReplaceParam } from "utils/input"

const profilePreset = {
  addon: {
    quickSwitch: [] as number[],
    lockExcerpt: false,
    screenAlwaysOn: false,
    // Single select is not allowed to be empty, generally set option to none
    hasTitleThen: [1],
    panelControl: [] as number[],
    panelPosition: [0],
    panelHeight: [1],
    autoBackup: false,
    showDocInfo: false
  },
  magicaction4card: {
    smartSelection: false,
    defaultMergeText: "\n"
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
  autocomment: {
    on: false,
    preset: [] as number[],
    citation: `(/^.*$/gs, "{{doc.author}} ( {{doc.publicationDate}} ) {{doc.title}}.{{doc.publisher}}, {{doc.publicationPlace}}.P{{page.real.start}}{{#page.real.end}}-P{{page.real.end}}{{/page.real.end}}", 1)`,
    customComment: ""
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
    profile: [0],
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
    on: false
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
    cacheTitle: {} as {
      [noteid: string]: [string, string, string][]
    },
    cacheComment: {} as {
      [noteid: string]: [string, string, string][]
    }
  }
}

// Cache Regex like [//,//];[//,//] 和 (//,"",0);(//,"",0);
const profileTempPreset = {
  replaceParam: {
    customTag: [] as ReplaceParam[] | undefined,
    customComment: [] as ReplaceParam[] | undefined,
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
