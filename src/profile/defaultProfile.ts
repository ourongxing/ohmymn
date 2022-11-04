import { Addon } from "~/addon"
import { RewriteCase } from "./typings"

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
    backupID: ""
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
    showY: false,
    selectionBarY: "[0, 70]",
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
    baiduFromLang: [0],
    caiyunFromLang: [0],
    baiduToLang: [0],
    caiyunToLang: [0]
  },
  additional: {
    lastVision: Addon.version,
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

export const rewriteSelection: RewriteCase[] = [
  {
    version: {
      from: "4.0.0",
      to: ">=4.0.6"
    },
    global: {
      addon: {
        quickSwitch: (old: number[]) => old.map(k => k + 1),
        panelPosition: (old: number[]) => [old[0] >= 1 ? old[0] + 2 : old[0]],
        cardAction: (old: number[]) => {
          const t = old[0]
          let n = t
          if (t >= 5) n += 2
          if (t >= 18) n += 2
          return [n]
        },
        textAction: (old: number[]) => [old[0] >= 10 ? old[0] + 1 : old[0]]
      },
      autoformat: {
        preset: (old: number[]) => old.map(k => (k > 1 ? k - 1 : k))
      }
    }
  },
  {
    version: {
      // 空格
      from: "4.0.6 - 4.0.9",
      to: ">=4.0.10"
    },
    global: {
      addon: {
        removeExcerpt: (old: number[]) => [old[0] === 2 ? 0 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.0.10",
      to: ">=4.0.11"
    },
    global: {
      autocomment: {
        preset: (old: number[]) => old.filter(k => k !== 1)
      }
    }
  },
  {
    version: {
      from: "4.0.11 - 4.0.13",
      to: ">=4.0.14"
    },
    global: {
      addon: {
        cardAction: (old: number[]) => [old[0] > 0 ? old[0] + 1 : old[0]],
        textAction: (old: number[]) => [old[0] > 0 ? old[0] + 1 : old[0]]
      }
    }
  },
  {
    version: {
      from: "4.0.14 - 4.0.15",
      to: ">=4.0.16"
    },
    global: {
      addon: {
        cardAction: (old: number[]) => [old[0] >= 56 ? old[0] + 1 : old[0]]
      }
    }
  }
]
