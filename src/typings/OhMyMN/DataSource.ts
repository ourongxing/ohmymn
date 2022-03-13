import { cellViewType } from "./enum"

export type ISection = {
  key: string
  header: string
  rows: IRow[]
}

interface KeyLabelBind {
  key: string
  label: string
  bind?: [string, number][]
}

export type IRowPlainText = {
  type: cellViewType.plainText
  label: string
  link?: string
  bind?: [string, number][]
}

export type IRowSwitch = Expand<
  {
    type: cellViewType.switch
    status: boolean
  } & KeyLabelBind
>

export type IRowSelect = Expand<
  {
    type: cellViewType.select | cellViewType.muiltSelect
    selections: number[]
    option: string[]
  } & KeyLabelBind
>

export type IRowInput = Expand<
  {
    type: cellViewType.input
    content: string
  } & Omit<KeyLabelBind, "label">
>

export type IRowInlineInput = Expand<
  {
    type: cellViewType.inlineInput
    content: string
  } & KeyLabelBind
>

export type IRowButton = Expand<
  {
    type: cellViewType.button | cellViewType.buttonWithInput
    module: string
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
