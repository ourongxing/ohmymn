import { MbBookNote, DocumentController } from "typings/MarginNote"
import { IRowButton } from "./Datasource"
import { DirectionOfSelection } from "./enum"
export * from "./Module"
export * from "./Datasource"

export interface EventHandler {
  (sender: {
    // 不是都有哈，具体要看发送了什么
    userInfo: {
      key: string
      option: number
      row: IRowButton
      content: string
      name: string
      status: boolean
      note: MbBookNote
      selections: number[]
      noteid: string
      arrow: DirectionOfSelection
      documentController: DocumentController
      winRect: CGRect
    }
  }): void
}

export interface GestureHandler {
  (sender: UIGestureRecognizer): void
}
