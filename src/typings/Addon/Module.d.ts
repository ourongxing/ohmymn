import { MbBookNote } from "typings/MarginNote"
import { CellViewType } from "./enum"

export type IConfig<T, K> = Expand<{
  name: string
  key?: string
  intro: string
  link?: string
  settings: ISetting<T>[]
  actions4card?: IAction<keyof K, IActionMethod4Card>[]
  actions4text?: IAction<keyof K, IActionMethod4Text>[]
}>

/** Help must be set before using link */
type HelpLink = XOR<{ help: string; link?: string }, {}>

type Bind<T> = {
  bind?: [PickKeyByValue<T, number[] | boolean>, number][]
}

type HelpLinkLabel = HelpLink & {
  label: string
}

export type ISettingInlineInput<T> = {
  key: PickKeyByValue<T, string>
  type: CellViewType.InlineInput
} & HelpLinkLabel &
  Bind<T>

export type ISettingInput<T> = {
  key: PickKeyByValue<T, string>
  type: CellViewType.Input
  help: string
  link?: string
} & Bind<T>

export type ISettingSwitch<T> = {
  key: PickKeyByValue<T, boolean>
  type: CellViewType.Switch
} & HelpLinkLabel &
  Bind<T>

export type ISettingSelect<T> = {
  key: PickKeyByValue<T, number[]>
  type: CellViewType.Select | CellViewType.MuiltSelect
  option: string[]
} & HelpLinkLabel &
  Bind<T>

export type ISetting<T> =
  | ISettingInput<T>
  | ISettingSelect<T>
  | ISettingSwitch<T>
  | ISettingInlineInput<T>

export type IAction<
  K,
  T extends IActionMethod4Card | IActionMethod4Text
> = Expand<{
  key: K
  label: string
  type: CellViewType.Button | CellViewType.ButtonWithInput
  /** auto generate. value is module's key*/
  module?: string
  /** auto generate. value is module's name*/
  moduleName?: string
  option?: string[]
  help?: string
  method: T
}>

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

export type ICheckMethod<T> = (input: string, key: keyof T) => undefined
