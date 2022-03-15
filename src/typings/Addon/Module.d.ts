import { MbBookNote } from "typings/MarginNote"
import { ReplaceParam } from "utils/input"
import { cellViewType } from "./enum"

export type IConfig<T, K> = Expand<{
  name: string
  key?: string
  intro: string
  link?: string
  settings: ISetting<keyof T>[]
  actions4card?: IAction<keyof K, IActionMethod4Card>[]
  actions4text?: IAction<keyof K, IActionMethod4Text>[]
}>

/** Help must be set before using link */
type HelpLink = XOR<{ help: string; link?: string }, {}>

interface KeyLabel<K> {
  key: K
  label: string
}

type KeyLabelHelpLinkBind<K> = HelpLink &
  KeyLabel<K> & {
    bind?: [K, number][]
  }

export type ISettingInlineInput<K> = Expand<
  {
    type: cellViewType.inlineInput
  } & KeyLabelHelpLinkBind<K>
>

export type ISettingInput<K> = Expand<
  {
    type: cellViewType.input
  } & HelpLink &
    Omit<KeyLabel<K>, "label"> & {
      bind?: [K, number][]
    }
>

export type ISettingSwitch<K> = Expand<
  {
    type: cellViewType.switch
  } & KeyLabelHelpLinkBind<K>
>

export type ISettingSelect<K> = Expand<
  {
    type: cellViewType.select | cellViewType.muiltSelect
    option: string[]
  } & KeyLabelHelpLinkBind<K>
>

export type ISetting<K> =
  | ISettingInput<K>
  | ISettingSelect<K>
  | ISettingSwitch<K>
  | ISettingInlineInput<K>

export type IAction<
  K,
  T extends IActionMethod4Card | IActionMethod4Text
> = Expand<{
  type: cellViewType.button | cellViewType.buttonWithInput
  /** auto generate. value is module's key*/
  module?: string
  /** auto generate. value is module's name*/
  moduleName?: string
  option?: string[]
  help?: string
  method: T
}> &
  KeyLabel<K>

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
