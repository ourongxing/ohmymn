import { type UIAlertView, UIAlertViewStyle } from "../low-level"
import { lang } from "./lang"
import { MN } from "./mn"
import { byteSlice } from "./utils"

/**
 * Show a message on the screen temporarily.
 * @param message
 * @param duration default `2`, unit `s`
 * @param window  default `MN.currentWindow`
 */
export function showHUD(
  message: string,
  duration = 2,
  window = MN.currentWindow
) {
  MN.app.showHUD(message, window, duration)
}

/**
 * Create a HUD on the screen and control it.
 * @example
 * HUDController.show('Loading...')
 * // do something
 * HUDController.hidden('Done')
 */
export const HUDController = {
  /**
   * @param message
   * @param window default `MN.currentWindow`
   */
  show(message: string, window = MN.currentWindow) {
    MN.app.waitHUDOnView(message, window)
  },
  /**
   * @param message If set, temporarily shows message on the screen when the HUD stops.
   * @param duration default `2`, unit `s`
   * @param window  default `MN.currentWindow`
   */
  hidden(message?: string, duration = 2, window = MN.currentWindow) {
    MN.app.stopWaitHUDOnView(window)
    message && showHUD(message, duration, window)
  }
}

/**
 * Alert a message on the screen, need to click to close.
 * But you can't get the result. @recommend use {@link confirm} instead.
 */
export function alert(message: string) {
  MN.app.alert(message)
}

/**
 * Popup a dialog. You can input text or select a button.
 * @param title default `MN.currentAddon.title`
 * @param message
 * @param type default `UIAlertViewStyle.Default`, only buttons. If you want to input text, use `UIAlertViewStyle.PlainTextInput` or `UIAlertViewStyle.`, but yet not support `UIAlertViewStyle.LoginAndPasswordInput`.
 * @param buttons default `[lang.sure]`
 * @param canCancel default `true`, if `false`, you can't cancel the dialog.
 * @param multiLine default `false`, if `true`, the button text will be removed `\n` and slice to 40 bytes.
 * @returns
 * - `inputContent` if `type` is `UIAlertViewStyle.Default`, it will be `undefined`.
 * - `buttonIndex` the index of the button you clicked. If you cancel the dialog, it will be `-1`.
 */
export function popup<T>({
  title = MN.currentAddon.title,
  message,
  type = UIAlertViewStyle.Default,
  buttons = [lang.sure],
  canCancel = true,
  multiLine = false
}: {
  title?: string
  message: string
  buttons?: string[]
  type?: UIAlertViewStyle
  canCancel?: boolean
  multiLine?: boolean
}) {
  return new Promise<{
    inputContent: string | undefined
    buttonIndex: number
  }>(resolve =>
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
            resolve({
              inputContent:
                type === UIAlertViewStyle.Default
                  ? undefined
                  : alert.textFieldAtIndex(0).text,
              buttonIndex: buttonIndex - 1
            })
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
            resolve({
              inputContent:
                type === UIAlertViewStyle.Default
                  ? undefined
                  : alert.textFieldAtIndex(0).text,
              buttonIndex: buttonIndex
            })
          }
        )
  )
}

/**
 * Popup a confirm dialog, and return the result.
 * @param title default `MN.currentAddon.title`
 * @param message optional
 * @returns
 */
export async function confirm(title = MN.currentAddon.title, message = "") {
  const { buttonIndex: option } = await popup({
    title,
    message,
    buttons: [lang.sure],
    multiLine: false,
    canCancel: true
  })
  return option === 0
}

/**
 * Popup a list of options dialog, and return the selected value.
 * @param title default `MN.currentAddon.title`
 * @param message optional
 * @param canCancel default `false`
 * @returns
 * - `value` the selected value
 * - `index` the index of the selected value
 * @example
 * const { value, index } = await select(['a', 'b', 'c'])
 */
export async function select(
  options: string[],
  title = MN.currentAddon.title,
  message = lang.make_your_choice,
  canCancel = false
) {
  const { buttonIndex: index } = await popup({
    title,
    message,
    buttons: options,
    multiLine: true,
    canCancel
  })
  return {
    value: options[index],
    index
  }
}
