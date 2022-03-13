import { MbBookNote } from "typings/MarginNote"
import { ReplaceParam } from "utils/input"
import { cellViewType } from "./enum"

export type IConfig = Expand<{
  name: string
  intro: string
  link?: string
  settings: ISetting[]
  actions4card?: IAction[]
  actions4text?: IAction[]
}>

/** Help must be set before using link */
type HelpLink = XOR<{ help: string; link?: string }, {}>

interface KeyLabel {
  key: string
  label: string
}

type KeyLabelHelpLinkBind = HelpLink &
  KeyLabel & {
    bind?: [string, number][]
  }

export type ISettingInlineInput = Expand<
  {
    type: cellViewType.inlineInput
  } & KeyLabelHelpLinkBind
>

export type ISettingInput = Expand<
  {
    type: cellViewType.input
  } & HelpLink &
    Omit<KeyLabel, "label"> & {
      bind?: [string, number][]
    }
>

export type ISettingSwitch = Expand<
  {
    type: cellViewType.switch
  } & KeyLabelHelpLinkBind
>

export type ISettingSelect = Expand<
  {
    type: cellViewType.select | cellViewType.muiltSelect
    option: string[]
  } & KeyLabelHelpLinkBind
>

export type ISettingButton = Expand<
  {
    type: cellViewType.button | cellViewType.buttonWithInput
    /** auto generate. value is module's name*/
    module?: string
    option?: string[]
    help?: string
  } & KeyLabel
>

export type ISetting =
  | ISettingInput
  | ISettingSelect
  | ISettingSwitch
  | ISettingInlineInput

export type IAction = ISettingButton

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

export interface ModuleProfile {
  profile?: {
    [k: string]: number[] | boolean | string
  }
  docProfile?: {
    [k: string]: number[] | boolean | string
  }
  profileTemp?: {
    replaceParam?: {
      [k: string]: ReplaceParam[] | undefined
    }
    regArray?: {
      [k: string]: RegExp[][] | undefined
    }
  }
}
