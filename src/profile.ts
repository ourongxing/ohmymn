const profileType = {
  ohmymn: {
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    autoCorrect: false,
    quickSwitch: [0],
    panelPostion: [0],
    panelHeight: [1]
  },
  autocomplete: {
    on: false,
    customComplete: `"{{zh}}"`
  },
  autostandardize: {
    on: false,
    toTitleCase: false
  },
  anotherautotitle: {
    on: true,
    mergeTitle: false,
    noPunctuation: false,
    changeTitleNoLimit: false,
    wordCount: "[10,5]",
    customBeTitle: ""
  },
  anotherautodef: {
    on: false,
    onlyDesc: false,
    toTitleLink: false,
    preset: [0],
    customDefTitle: ""
  },
  autolist: {
    on: false,
    preset: [0],
    customList: ""
  },
  autoreplace: {
    on: false,
    customReplace: ""
  }
}

const docProfileType = {
  ohmymn: {
    autoCorrect: false
  }
}

export type IProfile = typeof profileType
export type IProfile_doc = typeof docProfileType

const profile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile = {
  ...profileType
}

const docProfile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile_doc = {
  ...docProfileType
}

export { profile, docProfile }
