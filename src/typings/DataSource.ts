import { DataSourceSectionKeyUnion } from "~/merged"
import { CellViewType } from "."

export type ISection = {
  key: DataSourceSectionKeyUnion
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

export type IRowExpland = {
  type: CellViewType.Expland
  label: [string, string]
  key: string
  status: boolean
  bind?: BindType
}

export type IRowButton = {
  type: CellViewType.Button | CellViewType.ButtonWithInput
  module: DataSourceSectionKeyUnion
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
  | IRowExpland
