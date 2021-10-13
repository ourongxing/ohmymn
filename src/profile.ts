const profileType = {
  ohmymn: {
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    autoCorrect: false,
    panelPostion: [0],
    panelHeight: [1]
  },
  autocomplete: {
    on: false,
    custom: `"{{zh}}"`
  },
  autostandardize: {
    on: false
  },
  anotherautotitle: {
    on: false,
    mergeTitle: false,
    noPunctuation: false,
    changeTitleNoLimit: false,
    wordCount: "[10,5]",
    custom: ""
  },
  anotherautodef: {
    on: false,
    firstLetterCaps: false,
    preset: [0],
    custom: ""
  },
  autolist: {
    on: false,
    preset: [0],
    custom: ""
  },
  autoreplace: {
    on: false,
    custom: ""
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
