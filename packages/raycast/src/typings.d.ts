export interface OhMyMNAction {
  key: string
  /** need-input is type 3 */
  type: 2 | 3
  label: string
  option: string[]
  help: string
  module: string
  moduleName: string
}

export namespace CustomShortcut {
  type Type = "card" | "text"
  type Num = "1" | "2" | "3" | "4" | "5"
  type Action = {
    key: string
    input: string
    desc: string
  }
  interface Form {
    desc: string
    type: Type
    num: Num
    action_0: string
    action_1?: string
    action_2?: string
    action_3?: string
    action_4?: string
    action_input_0?: string
    action_input_1?: string
    action_input_2?: string
    action_input_3?: string
    action_input_4?: string
    action_input_desc_0?: string
    action_input_desc_1?: string
    action_input_desc_2?: string
    action_input_desc_3?: string
    action_input_desc_4?: string
  }
}
export interface Preferences {
  actionInChinese: boolean
  username: string
}

export interface LocalShortcut {
  form: CustomShortcut.Form
  url: string
  detail: string
  moduleNames: string[]
  createdTime: number
  modifiedTime: number
  uuid: string
  download?: boolean
  author?: string
  notionID?: string
}

export interface SharedShortcut {
  form: CustomShortcut.Form
  url: string
  detail: string
  moduleNames: string[]
  createdTime: number
  modifiedTime: number
  uuid: string
  download?: boolean
  author?: string
  notionID?: string
}
