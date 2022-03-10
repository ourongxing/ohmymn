import { MbBookNote } from "../MarginNote/MbBookNote"
import { IRowButton } from "./Datasource"

export interface IConfig {
  name: string
  key?: string
  intro: string
  link?: string
  settings: ISetting[]
  actions4card?: IAction[]
  actions4text?: IAction[]
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

interface LabelType {
  type: cellViewType
  label: string
  bind?: [string, number][]
}

interface KeyLabelType extends LabelType {
  key: string
}

interface ISettingBasic extends KeyLabelType {
  help?: string
  link?: string
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
  module?: string
}

export interface ISettingSelect extends ISettingBasic {
  type: cellViewType.select | cellViewType.muiltSelect
  option: string[]
}

export interface ISettingSwitch extends ISettingBasic {
  type: cellViewType.switch
}

export type IAction = IRowButton

export type IActionMethod4Card = ({
  content,
  nodes,
  option
}: {
  content: string
  nodes: MbBookNote[]
  option: number
}) => any

export type IActionMethod4Text = (text: string) => void

export interface IActionMethods {
  [k: string]: IActionMethod4Card
}
