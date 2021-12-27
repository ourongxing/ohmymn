const profilePreset = {
  ohmymn: {
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    autoCorrect: false,
    screenAlwaysOn: false,
    quickSwitch: [0],
    panelPostion: [0],
    panelHeight: [1]
  },
  autocomplete: {
    customComplete: `"{{zh}}"`
  },
  autostandardize: {
    preset: [0]
  },
  anotherautotitle: {
    preset: [0],
    mergeTitle: false,
    changeTitleNoLimit: false,
    wordCount: "[10,5]",
    customBeTitle: ""
  },
  anotherautodef: {
    preset: [0],
    onlyDesc: false,
    toTitleLink: false,
    customSplit: "",
    customSplitName: "",
    customDefTitle: ""
  },
  autolist: {
    preset: [0],
    customList: ""
  },
  autoreplace: {
    preset: [0],
    customReplace: ""
  }
}

/**
 * 单个插件开关
 */
export const enum on {
  anotherautotitle = 0,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist
}

type IProfile = typeof profilePreset
const profile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile = JSON.parse(JSON.stringify(profilePreset))

export { profile, profilePreset, IProfile }
