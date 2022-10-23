import queryString from "query-string"
import { actionKey4Card, actionKey4Text, dataSourceIndex } from "~/dataSource"
import handleMagicAction from "~/JSExtension/handleMagicAction"
import { switchPanel } from "~/JSExtension/switchPanel"
import lang from "./lang"
import { isModuleON } from "~/merged"
import { showHUD } from "marginnote"
import { IRowButton } from "~/typings"

export async function handleURLScheme(params: string) {
  try {
    // marginnote3app://addon/ohmymn?type=card&shortcut=1
    // marginnote3app://addon/ohmymn?type=text&shortcut=1
    // marginnote3app://addon/ohmymn?type=pro&action=renameTitle&option=1&content=1
    const { type, shortcut, action, option, content } =
      queryString.parse(params)
    switch (type) {
      case "card":
      case "text": {
        const num = Number(shortcut)
        if (
          !Number.isInteger(num) ||
          (type === "card" && (num < 1 || num > 8)) ||
          (type === "text" && (num < 1 || num > 4))
        )
          throw lang.shortcut_pro
        const opt = self.globalProfile.shortcut[
          `${type}Shortcut${Number(shortcut) - 1}`
        ] as [number]
        const { key, module, option, moduleName } =
          type === "card" ? actionKey4Card[opt[0]] : actionKey4Text[opt[0]]
        if (key === "none") return
        else if (key == "switchPanel") switchPanel()
        else if (module && !isModuleON(module))
          showHUD(`${moduleName ?? module} ${lang.action_not_work}`, 2)
        else {
          const [sec, row] =
            dataSourceIndex[
              type === "card" ? "magicaction4card" : "magicaction4text"
            ][key]
          await handleMagicAction(
            type,
            self.dataSource[sec].rows[row] as IRowButton,
            option
          )
        }
        break
      }
      case "pro": {
        const { shortcutPro } = self.globalProfile.shortcut
        if (!shortcutPro) return
        if (!action) throw lang.no_action
        const ret = (() => {
          const r = actionKey4Card.find(k => k.key === action)
          if (r)
            return {
              ...r,
              type: "card" as "card" | "text"
            }
          const k = actionKey4Text.find(k => k.key === action)
          if (k)
            return {
              ...k,
              type: "text" as "card" | "text"
            }
        })()
        if (!ret) return lang.action_not_exist
        const { key, module, moduleName, type } = ret
        if (module && !isModuleON(module))
          throw `${moduleName ?? module} ${lang.action_not_work}`
        else {
          const [sec, row] =
            dataSourceIndex[
              type === "card" ? "magicaction4card" : "magicaction4text"
            ][key]
          if (option !== null && !Number.isInteger(Number(option)))
            throw lang.option_interger
          const opt = option === null ? undefined : Number(option)
          await handleMagicAction(
            type,
            self.dataSource[sec].rows[row] as IRowButton,
            opt,
            content === null ? undefined : String(content)
          )
        }
      }
    }
  } catch (e) {
    showHUD(String(e), 2)
    dev.error(e)
  }
}
