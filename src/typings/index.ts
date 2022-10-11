import type {
  MbBookNote,
  DocumentController,
  DirectionOfSelection
} from "marginnote"
import { IRowButton } from "./DataSource"
export * from "./Module"
export * from "./DataSource"
export * from "./AutoUtils"

export const enum CellViewType {
  PlainText = 0,
  Switch = 1,
  Button = 2,
  ButtonWithInput = 3,
  Input = 4,
  InlineInput = 5,
  Select = 6,
  MuiltSelect = 7
}
export interface EventHandler {
  (sender: {
    // 不是都有哈，具体要看发送了什么
    userInfo: {
      key: string
      option: number
      row: IRowButton
      content: string
      name: string
      type: "text" | "card"
      status: boolean
      note: MbBookNote
      selections: number[]
      message: string
      noteid: string
      arrow: DirectionOfSelection
      /**
       * returns a {@link DocumentController} instance
       */
      documentController: DocumentController
      winRect: string
    }
  }): void
}

export interface GestureHandler {
  (sender: UIGestureRecognizer): void
}
