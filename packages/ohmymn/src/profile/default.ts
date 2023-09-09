import { Addon } from "~/addon"

export const defaultGlobalProfile = {
  addon: {
    quickSwitch: [],
    lockExcerpt: false,
    dragMerge: [1],
    hasTitleThen: [1],
    removeExcerpt: [0],
    panelControl: [],
    panelPosition: [0],
    panelHeight: [1],
    autoBackup: false,
    useMarkdown: false,
    backupID: "",
    doubleLink: false
  },
  magicaction4card: {
    smartSelection: false,
    defaultMergeText: `%["1"]. $&\\n\\n`
  },
  magicaction4text: {
    showCopyContent: false,
    noteOptions: []
  },
  gesture: {
    singleBarSwipeUpShortcut: "",
    singleBarSwipeDownShortcut: "",
    singleBarSwipeRightShortcut: "",
    singleBarSwipeLeftShortcut: "",
    muiltBarSwipeUpShortcut: "",
    muiltBarSwipeDownShortcut: "",
    muiltBarSwipeRightShortcut: "",
    muiltBarSwipeLeftShortcut: "",
    selectionBarSwipeUpShortcut: "",
    selectionBarSwipeDownShortcut: "",
    selectionBarSwipeRightShortcut: "",
    selectionBarSwipeLeftShortcut: "",
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
  toolbar: {
    cardToolbar0: [0],
    cardToolbar1: [0],
    cardToolbar2: [0],
    cardToolbar3: [0],
    cardToolbar4: [0],
    cardToolbar5: [0],
    cardToolbar6: [0],
    cardToolbar7: [0],
    textToolbar0: [0],
    textToolbar1: [0],
    textToolbar2: [0],
    textToolbar3: [0],

    cardToolbar0Shortcut: "",
    cardToolbar1Shortcut: "",
    cardToolbar2Shortcut: "",
    cardToolbar3Shortcut: "",
    cardToolbar4Shortcut: "",
    cardToolbar5Shortcut: "",
    cardToolbar6Shortcut: "",
    cardToolbar7Shortcut: "",
    textToolbar0Shortcut: "",
    textToolbar1Shortcut: "",
    textToolbar2Shortcut: "",
    textToolbar3Shortcut: ""
  },
  shortcut: {
    shortcutPro: false,
    cardShortcut0: [0],
    cardShortcut1: [0],
    cardShortcut2: [0],
    cardShortcut3: [0],
    cardShortcut4: [0],
    cardShortcut5: [0],
    cardShortcut6: [0],
    cardShortcut7: [0],
    textShortcut0: [0],
    textShortcut1: [0],
    textShortcut2: [0],
    textShortcut3: [0]
  },
  autocomplete: {
    on: false,
    fillWordInfo: [0],
    dataSource: [0],
    customFillFront:
      "{{#phonetic}}🔈[{{phonetic}}] {{/phonetic}} {{collins}}{{#tags}}\\n🏷 {{tags}}{{/tags}}",
    customFill: "✍🏻\\n{{zh}}\\n👀",
    selectLemma: false,
    selectMeanings: [],
    autoContext: false,
    translateContext: false,
    collins: [0, 1, 2, 3, 4, 5]
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
    wordCount: "[10, 5]",
    customBeTitle: ""
  },
  anotherautodef: {
    on: false,
    preset: [],
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
  autosimplify: {
    variant: [0],
    taiwanIdiom: true,
    customSimplify: `(/壹/g, "一"); (/妳/g, "你")`
  },
  autotag: {
    on: false,
    preset: [],
    customTag: ""
  },
  autocomment: {
    on: false,
    preset: [],
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
    customContent: "[{{titles.0}}]({{url.pure}})",
    customSearchContent: "[{{titles.0}}]({{url.pure}})",
    showSearchEngine: false,
    modifySymbols: '%["1"]. $&\\n\\n',
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
    markdown: [2],
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
    baiduFromLang: [2],
    caiyunFromLang: [2],
    baiduToLang: [0],
    caiyunToLang: [0]
  },
  aitranslate: {
    on: false,
    wordCount: "[10, 5]",
    openaiFromLang: [5],
    openaiToLang: [0]
  },
  aiassistant: {
    on: false,
    wordCount: "[10, 5]",
    prompt: [0],
    openaiToLang: [0]
  },
  ai: {
    OpenAIApiKey: "",
    OpenAIBaseURL: "api.openai.com",
    defaultTemperature: "0.6",
    showKey: true,
    promptsURL: "",
    model: [0]
  },
  additional: {
    lastVision: Addon.version,
    settingViewFrame: "{}",
    // 最好不要多层对象，不允许被修改
    autoocr: {
      lastGetToken: 0,
      baiduToken: ""
    }
  }
}

// Each document has a independent profile
export const defaultDocProfile = {
  magicaction4text: {
    preOCR: false,
    preSimplify: false,
    preFormat: false
  },
  autoocr: {
    on: false,
    lang: [0]
  },
  autoformat: {
    removeSpace: false
  },
  autosimplify: {
    on: false
  },
  additional: {
    // 如果摘录时发现一直没有开启在线矫正，就不再等了。如果你开启了在线矫正，将自动开启该选项。
    needOCRWait: true
  }
}

export const defaultNotebookProfile = {
  addon: {
    profile: [0]
  },
  // Information not displayed on the UI
  additional: {
    cacheTitle: {} as Record<string, [string, string, string][] | undefined>,
    cacheComment: {} as Record<string, [string, string, string][] | undefined>,
    cacheTag: {} as Record<string, [string, string, string][] | undefined>
  }
}

// Cache Regex like [//,//];[//,//] 和 (//,"",0);(//,"",0);
export const defaultTempProfile = {
  replaceParam: {
    customTag: [],
    customComment: [],
    customList: [],
    customReplace: [],
    customExtractTitle: [],
    customSimplify: [],
    customFormat: []
  },
  regArray: {
    customTitleSplit: [],
    customBeTitle: [],
    customDefLink: []
  }
}

export const customKey = [
  ...Object.keys(defaultTempProfile.regArray),
  ...Object.keys(defaultTempProfile.replaceParam)
]
