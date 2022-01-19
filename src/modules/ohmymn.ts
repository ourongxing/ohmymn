import { Addon } from "const"
import lang from "lang"
import { cellViewType, IConfig } from "types/Addon"
import { UIAlertViewStyle } from "types/UIKit"
import { openUrl, popup } from "utils/common"
import fetch from "utils/network"

export const enum PanelPosition {
  Auto,
  Left,
  Center,
  Right
}

export const enum PanelHeight {
  Higher,
  Standard,
  Lower
}

export const enum PanelControl {
  DoubleClickOpen,
  DoubleClickClose,
  CompleteClose
}

export const enum HasTitleThen {
  ExpertText,
  TitleLink,
  OverrideTitle
}

const { link, label, help, option, detect_update } = lang.module.ohmymn
const config: IConfig = {
  name: Addon.title,
  intro: `version: ${Addon.version}\nmade by ${Addon.author} with ❤️`,
  link,
  settings: [
    {
      help: help.profile,
      key: "profile",
      type: cellViewType.select,
      option: Array(5)
        .fill(option.profile)
        .map((_, index) => _ + " " + (index + 1)),
      label: label.profile
    },
    {
      label: label.quick_switch,
      key: "quickSwitch",
      type: cellViewType.muiltSelect,
      option: []
    },
    {
      key: "panelPosition",
      type: cellViewType.select,
      option: option.panel_position,
      label: label.panel_position
    },
    {
      key: "panelHeight",
      type: cellViewType.select,
      option: option.panel_height,
      label: label.panel_height
    },
    {
      key: "panelControl",
      type: cellViewType.muiltSelect,
      option: option.panle_control,
      label: label.panle_control
    },
    {
      key: "detectUpdate",
      type: cellViewType.select,
      option: option.detect_update,
      label: label.detect_update
    },
    {
      key: "screenAlwaysOn",
      type: cellViewType.switch,
      label: label.screen_always_on
    },
    {
      key: "lockExcerpt",
      type: cellViewType.switch,
      label: label.lock_excerpt
    },
    {
      key: "hasTitleThen",
      type: cellViewType.select,
      label: label.has_title_then,
      help: help.has_title_then,
      option: option.has_title_then
    },
    {
      help: help.auto_correct,
      key: "autoCorrect",
      type: cellViewType.switch,
      label: label.auto_correct
    }
  ],
  actions: []
}

export const enum DetectUpdate {
  None,
  EveryDay,
  EveryMonday,
  EveryDayOnlySigned,
  EveryMondayOnlySigned
}

type UpdateInfo = {
  name?: string
  version: string
  signed: boolean
  link: string
  time: string
}

const util = {
  async detect(onlySigned = false) {
    const updateInfo: UpdateInfo = await fetch(
      `https://mnaddon-update-reminder.vercel.app/${
        Addon.key
      }?timestamp=${Date.now()}`
    ).then(res => res.json())
    const { name, version, signed, link, time } = updateInfo
    if (name && name == Addon.key) {
      if ((onlySigned && !signed) || version == Addon.version) return
      const { option } = await popup(
        "OhMyMN",
        detect_update.tip(time, version, signed),
        UIAlertViewStyle.Default,
        [detect_update.check_update],
        (alert: UIAlertView, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      if (option === 0) openUrl(link)
    }
  },
  async detectUpdate() {
    const { detectUpdate, detectUpdateInfo } = self.profile.ohmymn
    if (detectUpdate[0] == DetectUpdate.None) return

    const thisDay = new Date().getDay()
    if (detectUpdateInfo.day == thisDay) return
    else detectUpdateInfo.day = thisDay

    switch (detectUpdate[0]) {
      case DetectUpdate.EveryDay:
        this.detect()
        break
      case DetectUpdate.EveryDayOnlySigned:
        this.detect(true)
        break
      case DetectUpdate.EveryMonday:
        if (thisDay == 1) this.detect()
        break
      case DetectUpdate.EveryMondayOnlySigned:
        if (thisDay == 1) this.detect(true)
        break
    }
  }
}
const action = {}
export { config, util, action }
