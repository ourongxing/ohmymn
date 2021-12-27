import { MbBookNote } from "./MarginNote/MbBookNote"

interface LabelType {
  type: cellViewType
  label: string
}

interface KeyLabelType extends LabelType {
  key: string
}

interface ISettingBasic extends KeyLabelType {
  help?: string
  link?: string
}

export const enum cellViewType {
  plainText = 0,
  switch = 1,
  button = 2,
  buttonWithInput = 3,
  input = 4,
  inlineInput = 5,
  select = 6,
  muiltSelect = 7
}

export interface IConfig {
  name: string
  intro: string
  link?: string
  settings: ISetting[]
  actions: IAction[]
}

export type ISetting =
  | ISettingButton
  | ISettingInput
  | ISettingSwitch
  | ISettingSelect

export interface ISettingInput extends ISettingBasic {
  type: cellViewType.input | cellViewType.inlineInput
}

export interface ISettingButton extends ISettingBasic {
  type: cellViewType.button | cellViewType.buttonWithInput
  /** button 的 link 不起作用 */
  link?: undefined
  option?: string[]
}

export interface ISettingSelect extends ISettingBasic {
  type: cellViewType.select | cellViewType.muiltSelect
  option: string[]
}

export interface ISettingSwitch extends ISettingBasic {
  type: cellViewType.switch
}

export type IAction = IRowButton

// 生成的 DataSource
export interface ISection {
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

export interface IRowButton extends KeyLabelType {
  type: cellViewType.button | cellViewType.buttonWithInput
  help?: string
  option?: string[]
}

export interface IRowSelect extends KeyLabelType {
  type: cellViewType.select | cellViewType.muiltSelect
  selections: number[]
  option: string[]
}

export interface IActionMethod {
  [k: string]: ({
    content,
    nodes,
    option
  }: {
    content: string
    nodes: MbBookNote[]
    option: number
  }) => any
}
