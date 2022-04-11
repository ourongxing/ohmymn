import lang from "lang"
import { UIAlertViewStyle } from "typings/enum"
import { byteSlice } from "./text"

function popup<T>(
  {
    title,
    message,
    type = UIAlertViewStyle.Default,
    buttons,
    canCancel = true,
    multiLine = false
  }: {
    title: string
    message: string
    buttons: string[]
    type?: UIAlertViewStyle
    canCancel?: boolean
    multiLine?: boolean
  },
  f: ({ alert, buttonIndex }: { alert: UIAlertView; buttonIndex: number }) => T
) {
  return new Promise<T>(resolve =>
    canCancel
      ? UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          title,
          message,
          type,
          lang.cancel,
          multiLine
            ? buttons.map(k => byteSlice(k.replace(/\n/g, ""), 0, 40))
            : buttons,
          (alert: UIAlertView, buttonIndex: number) => {
            resolve(
              f({
                alert,
                buttonIndex: buttonIndex - 1
              })
            )
          }
        )
      : UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          title,
          message,
          type,
          multiLine
            ? byteSlice(buttons[0].replace(/\n/g, ""), 0, 40)
            : buttons[0],
          multiLine
            ? buttons.slice(1).map(k => byteSlice(k.replace(/\n/g, ""), 0, 40))
            : buttons.slice(1),
          (alert: UIAlertView, buttonIndex: number) => {
            resolve(
              f({
                alert,
                buttonIndex
              })
            )
          }
        )
  )
}

export default popup
