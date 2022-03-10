import { cellViewType } from "./enum"
import { ISettingButton, KeyLabelType, LabelType } from "./Module"

// 生成的 DataSource
export interface ISection {
  key: string
  header: string
  rows: Array<IRow>
}

export type IRow =
  | IRowPlainText
  | IRowSwitch
  | IRowInput
  | IRowButton
  | IRowSelect

export interface IRowPlainText extends LabelType {
  type: cellViewType.plainText
  link: string
}

export interface IRowSwitch extends KeyLabelType {
  type: cellViewType.switch
  status: boolean
}

export interface IRowInput extends KeyLabelType {
  type: cellViewType.input | cellViewType.inlineInput
  content: string
}

export type IRowButton = ISettingButton

export interface IRowSelect extends KeyLabelType {
  type: cellViewType.select | cellViewType.muiltSelect
  selections: number[]
  option: string[]
}
