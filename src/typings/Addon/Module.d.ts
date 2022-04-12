import { IAllProfile } from "profile"
import { MbBookNote } from "typings/MarginNote"
import { CellViewType } from "./enum"

export type IConfig<T extends keyof IAllProfile = keyof IAllProfile> = {
  name: string
  key?: string
  intro: string
  link?: string
  settings: ISetting<IAllProfile[T]>[]
  actions4card?: IAction<IActionMethod4Card>[]
  actions4text?: IAction<IActionMethod4Text>[]
}

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
  check?: ICheckMethod
} & HelpLinkLabel &
  Bind<T>

export type ISettingInput<T> = {
  key: PickKeyByValue<T, string>
  type: CellViewType.Input
  help: string
  link?: string
  check?: ICheckMethod
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

export type IAction<T extends IActionMethod4Card | IActionMethod4Text> = {
  key: string
  label: string
  type: CellViewType.Button | CellViewType.ButtonWithInput
  /** auto generate. value is module's key*/
  module?: string
  /** auto generate. value is module's name*/
  moduleName?: string
  option?: string[]
  help?: string
  method: T
  check?: ICheckMethod
}

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
}) => any

export type ICheckMethod = ({ input }: { input: string }) => MaybePromise<void>
