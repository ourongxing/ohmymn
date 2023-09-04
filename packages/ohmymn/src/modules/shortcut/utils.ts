import { showHUD } from "marginnote"
import qs from "querystringify"
import { actionKey4Card, actionKey4Text, dataSourceIndex } from "~/dataSource"
import handleMagicAction from "~/jsExtension/handleMagicAction"
import { switchPanel } from "~/jsExtension/switchPanel"
import { isModuleON } from "~/coreModule"
import type { IRowButton } from "~/typings"
import lang from "./lang"

export async function handleURLScheme(params: string) {
  try {
    // marginnote3app://addon/ohmymn?type=card&shortcut=1
    // marginnote3app://addon/ohmymn?type=text&shortcut=1
    // marginnote3app://addon/ohmymn?actions=JSON.stringify(actions)
    const query = qs.parse(params) as Record<string, string>
    if ("info" in query || "actions" in query) {
      if (!self.globalProfile.shortcut.shortcutPro) return showHUD(lang.pro)
      let shortcuts: {
        action: string
        type: "text" | "card"
        option: string
        content?: string
      }[] = []
      try {
        const { info, actions } = query
        shortcuts = JSON.parse(actions || info)

        if (!shortcuts.length) throw ""
      } catch (error) {
        throw lang.info_error
      }
      for (const shortcut of shortcuts) {
        const { type, action, option, content } = shortcut
        if (!action) throw lang.no_action
        const ret = (() => {
          if (type === "card") {
            const r = actionKey4Card.find(k => k.key === action)
            if (r)
              return {
                ...r,
                type: "card" as "card" | "text"
              }
          } else if (type === "text") {
            const k = actionKey4Text.find(k => k.key === action)
            if (k)
              return {
                ...k,
                type: "text" as "card" | "text"
              }
          } else {
            throw lang.type_not_exist
          }
        })()
        if (!ret) throw lang.action_not_exist
        const { key, module, moduleName, type: _type } = ret
        if (module && !isModuleON(module)) {
          throw `${moduleName ?? module} ${lang.action_not_work}`
        } else {
          const [sec, row] =
            dataSourceIndex[
              _type === "card" ? "magicaction4card" : "magicaction4text"
            ][key]
          await handleMagicAction(
            _type,
            self.dataSource[sec].rows[row] as IRowButton,
            option === undefined ? 0 : Number(option),
            content === undefined ? "" : String(content)
          )
        }
      }
    } else {
      const { type, shortcut } = query
      switch (type) {
        case "card":
        case "text": {
          const num = Number(shortcut)
          if (
            !Number.isInteger(num) ||
            (type === "card" && (num < 1 || num > 8)) ||
            (type === "text" && (num < 1 || num > 4))
          )
            throw lang.shortcut_range
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
        default: {
          throw lang.type_not_exist
        }
      }
    }
  } catch (e) {
    showHUD(String(e), 2)
    MN.error(e)
  }
}
