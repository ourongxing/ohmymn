import { Addon } from "~/addon"

export const defaultGlobalProfile = {
  addon: {
    panelControl: [],
    panelPosition: [0],
    panelHeight: [1],
    autoBackup: false,
    backupID: "",
    doubleLink: false
  },
  magicaction: {},
  additional: {
    lastVision: Addon.version
  }
}

// Each document has a independent profile
export const defaultDocProfile = {
  additional: {}
}

export const defaultNotebookProfile = {
  additional: {}
}
