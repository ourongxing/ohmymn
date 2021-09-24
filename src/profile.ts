const profileType = {
  ohmymn: {
    rightMode: false,
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    selectChildren: false,
    autoCorrect: false,
  },
  autocomplete: {
    on: false,
    fillExplanation: false,
    fillFrequency: false,
  },
  autostandardize: {
    on: false,
  },
  anotherautotitle: {
    on: false,
    mergeTitle: false,
    noPunctuation: false,
    changeTitleNoLimit: false,
    wordCount: "10",
    customTitle: "",
  },
  autolist: {
    on: false,
    multipleChoiceEnhance: false,
    wrapWhenSemicolon: false,
    customList: "",
  },
  autoreplace: {
    on: false,
    customReplace: "",
  },
}

const docProfileType = {
  autoCorrect: false,
}

export type IProfile = typeof profileType
export type IProfile_doc = typeof docProfileType

const profile: { [k: string]: { [k: string]: boolean | string } } & IProfile = {
  ...profileType,
}

const docProfile: IProfile_doc = {
  ...docProfileType,
}

export { profile, docProfile }
