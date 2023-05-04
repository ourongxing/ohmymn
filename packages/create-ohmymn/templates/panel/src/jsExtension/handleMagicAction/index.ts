import { MN, popup, showHUD, UIAlertViewStyle } from "marginnote"
import { checkInputCorrect } from "~/coreModule"
import { getMNLinkValue } from "~/profile"
import type { IRowButton } from "~/typings"
import { CellViewType } from "~/typings"
import lang from "../lang"
import handleCardAction from "./handleCardAction"

export default async (
  type: "card" | "text",
  row: IRowButton,
  option?: number,
  content?: string
) => {
  if (option !== undefined && content !== undefined) {
    const text = content ? getMNLinkValue(content) : ""
    // Allowed to be empty
    if (text === "" || (text && (await checkInputCorrect(text, row.key)))) {
      await handler({
        type,
        key: row.key,
        option,
        content: text
      })
      return
    }
  } else if (option !== undefined) {
    await handler({ type, key: row.key, option })
  } else
    switch (row.type) {
      case CellViewType.ButtonWithInput:
        while (1) {
          const { buttonIndex: option, inputContent: content } = await popup({
            title: row.label,
            message: row.help ?? "",
            type: UIAlertViewStyle.PlainTextInput,
            // It is better to have only two options, because then the last option will be automatically selected after the input
            buttons: row.option ? row.option : [lang.sure]
          })
          if (option === -1) return
          const text = content ? getMNLinkValue(content)?.trim() : ""
          if (text === undefined) {
            showHUD(lang.read_failed)
          }
          // Allowed to be empty
          else if (
            text === "" ||
            (text && (await checkInputCorrect(text, row.key)))
          ) {
            await handler({
              type,
              key: row.key,
              option,
              content: text
            })
            return
          }
        }
      case CellViewType.Button:
        const { buttonIndex: option } = await popup({
          title: row.label,
          message: row.help ?? "",
          type: UIAlertViewStyle.Default,
          buttons: row.option ?? [lang.sure]
        })
        if (option === -1) return
        await handler({
          type,
          key: row.key,
          option
        })
    }
}

async function handler({
  type,
  key,
  option,
  content
}: {
  type: "card" | "text"
  key: string
  option: number
  content?: string
}) {
  try {
    await handleCardAction(key, option, content ?? "")
  } catch (err) {
    MN.error(String(err))
  }
}
