# 弹窗
[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/popup.ts)

## showHUD

在屏幕上临时显示一条消息。
```ts
/**
 * @param message
 * @param duration default `2`, unit `s`
 * @param window  default `MN.currentWindow`
 */
declare function showHUD(message: string, duration?: number, window?: any): void;
```

## HUDController

在屏幕上显示一条消息，并且可以控制何时消失。

```ts
declare const HUDController: {
    /**
     * @param message
     * @param window default `MN.currentWindow`
     */
    show(message: string, window?: any): void;
    /**
     * @param message If set, temporarily shows message on the screen when the HUD stops.
     * @param duration default `2`, unit `s`
     * @param window  default `MN.currentWindow`
     */
    hidden(message?: string, duration?: number, window?: any): void;
};
```
如何使用：
```ts
import { HUDController } from "marginnote"
HUDController.show("Loading...")
// do something
HUDController.hidden("Done")
```

## Alert

显示一个提示框，需要点击才能关闭。但是无法获取结果，如果获取点击结果，可以使用 [confirm](#confirm)。
```ts
declare function alert(message: string): void;
```
## popup

弹出对话框，输入框，选择框等。

```ts
declare function popup<T>({ title, message, type, buttons, canCancel, multiLine }: {
    title?: string;
    message: string;
    buttons?: string[];
    type?: UIAlertViewStyle;
    canCancel?: boolean;
    multiLine?: boolean;
}): Promise<{
    inputContent: string | undefined;
    buttonIndex: number;
}>;
```
参数，是一个 options 对象，包含以下属性：

- `title` 默认 `MN.currentAddon.title`
- `message`
- `type` 默认 `UIAlertViewStyle.Default`，只有按钮.如果需要输入文字，请使用 `UIAlertViewStyle.PlainTextInput` 或者 `UIAlertViewStyle.`, 但是现在不支持 `UIAlertViewStyle.LoginAndPasswordInput`.
- `buttons` 默认 `[lang.sure]`，也就是确定。
- `canCancel` 默认 `true`, 如果为 `false`，你必须选择一个选项。
- `multiLine` 默认 `false`, 如果为 `true`，按钮文本将移除 `\n`，并被减少到 40 个字节。

UIAlertViewStyle:
```ts
export const enum UIAlertViewStyle {
  /**
   * The default alert view style. The default.
   */
  Default,
  /**
   * Allows the user to enter text, but the text field is obscured.
   */
  SecureTextInput,
  /**
   * Allows the user to enter text.
   */
  PlainTextInput,
  /**
   * Allows the user to enter a login id and a password.
   * @deprecated not support yet
   */
  LoginAndPasswordInput
}
```

返回值：
- `inputContent` 输入框里的输入，如果 `type` 为 `UIAlertViewStyle.Default` 返回 `undefined`。
- `buttonIndex` 点击的按钮的索引。如果取消该对话框，它将为 -1。

如何使用:
```ts
import { popup } from "marginnote"
async function confirm(title = MN.currentAddon.title, message = "") {
  const { buttonIndex: option } = await popup({
    title,
    message,
    buttons: [lang.sure],
    multiLine: false,
    canCancel: true
  })
  return option === 0
}
```

## confirm

弹出一个确认对话框，并返回结果。
```ts
/**
 * @param title default `MN.currentAddon.title`
 * @param message optional
 */
declare function confirm(title?: string, message?: string): Promise<boolean>;
```

## select

弹出一个选项列表对话框，并返回选定的值。
```ts
/**
 * @param title default `MN.currentAddon.title`
 * @param message optional
 * @param canCancel default `false`
 */
declare function select(options: string[], title?: string, message?: string, canCancel?: boolean): Promise<{
    value: string;
    index: number;
}>;
```
返回值：
- `value` 选择的值
- `index` 选择的值的索引

如何使用:
```ts
const { value, index } = await select(['a', 'b', 'c'])
```