import { ModuleKeyType, DataSourceSection } from "~/merged"
import { CellViewType } from "."

export type ISection = {
  key: DataSourceSection
  header: string
  rows: IRow[]
}

export type BindType = MaybeArray<
  MaybeArray<[string, number | number[] | boolean]>
>

type KeyLabelBind = {
  key: string
  label: string
  bind?: BindType
}

export type IRowPlainText = {
  type: CellViewType.PlainText
  link?: string
} & Omit<KeyLabelBind, "key">

export type IRowSwitch = Expand<
  {
    type: CellViewType.Switch
    status: boolean
  } & KeyLabelBind
>

export type IRowSelect = {
  type: CellViewType.Select | CellViewType.MuiltSelect
  selections: number[]
  option: string[]
} & KeyLabelBind

export type IRowInput = {
  type: CellViewType.Input
  content: string
} & Omit<KeyLabelBind, "label">

export type IRowInlineInput = {
  type: CellViewType.InlineInput
  content: string
} & KeyLabelBind

export type IRowButton = {
  type: CellViewType.Button | CellViewType.ButtonWithInput
  module: DataSourceSection
  moduleName: string
  option?: string[]
  help?: string
} & Omit<KeyLabelBind, "bind">

export type IRow =
  | IRowButton
  | IRowPlainText
  | IRowInlineInput
  | IRowInput
  | IRowSelect
  | IRowSwitch
