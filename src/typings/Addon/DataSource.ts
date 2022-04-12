import { ModuleKeyType } from "@/synthesizer"
import { CellViewType } from "./enum"

export type ISection = {
  key: ModuleKeyType
  header: string
  rows: IRow[]
}

interface KeyLabelBind {
  key: string
  label: string
  bind?: [string, number][]
}

export type IRowPlainText = {
  type: CellViewType.PlainText
  label: string
  link?: string
  bind?: [string, number][]
}

export type IRowSwitch = Expand<
  {
    type: CellViewType.Switch
    status: boolean
  } & KeyLabelBind
>

export type IRowSelect = Expand<
  {
    type: CellViewType.Select | CellViewType.MuiltSelect
    selections: number[]
    option: string[]
  } & KeyLabelBind
>

export type IRowInput = Expand<
  {
    type: CellViewType.Input
    content: string
  } & Omit<KeyLabelBind, "label">
>

export type IRowInlineInput = Expand<
  {
    type: CellViewType.InlineInput
    content: string
  } & KeyLabelBind
>

export type IRowButton = Expand<
  {
    type: CellViewType.Button | CellViewType.ButtonWithInput
    module: ModuleKeyType
    moduleName: string
    option?: string[]
    help?: string
  } & Omit<KeyLabelBind, "bind">
>

export type IRow =
  | IRowButton
  | IRowPlainText
  | IRowInlineInput
  | IRowInput
  | IRowSelect
  | IRowSwitch
