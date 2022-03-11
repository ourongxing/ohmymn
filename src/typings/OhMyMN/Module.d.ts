import { MbBookNote } from "../MarginNote/MbBookNote"
import { IRowButton } from "./Datasource"
import { cellViewType } from "./enum"

export interface IConfig {
  name: string
  intro: string
  link?: string
  settings: ISetting[]
  actions4card?: IAction[]
  actions4text?: IAction[]
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

export type IActionMethod4Text = ({
  text,
  imgBase64,
  option
}: {
  text: string
  imgBase64: string
  option: number
}) => void

export interface Methods<T> {
  [k: string]: T
}
