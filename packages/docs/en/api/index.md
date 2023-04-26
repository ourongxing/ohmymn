# API

## MN

```ts
import { MN } from "marginnote"
```

It has the following attributes/methods:
- `app`
- `db`
- `studyController`
- `notebookController`
- `currentDocumentController`
- `currentDocument`
- `currentThemeColor`
- `currentAddon`
- `currentDocmd5`
- `isZH`
- `version`
- `isMNE`
- `isMac`
- `isMacMNE`
- `isMacMN3`
- `themeColor`
  - `Gray`
  - `Default`
  - `Dark`
  - `Green`
  - `Sepia`

## showHUD()
Show a HUD on the screen temporarily.
- Type:
```ts
/**
 * @param message
 * @param duration @default 2
 * @param window  @default MN.currentWindow
 */
showHUD(message: string, view: UIView, duration: number): void;
```
