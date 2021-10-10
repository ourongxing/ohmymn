export {}
declare global {
  const enum cellViewType {
    plainText = 0,
    switch = 1,
    button = 2,
    buttonWithInput = 3,
    input = 4,
    inlineInput = 5,
    select = 6,
    muiltSelect = 7
  }

  interface IConfig {
    name: string
    intro: string
    link?: string
    settings: ISetting[]
    actions: IAction[]
  }

  type ISetting =
    | ISettingButton
    | ISettingInput
    | ISettingSwitch
    | ISettingSelect
  interface ISettingInput {
    key: string
    type: cellViewType.input | cellViewType.inlineInput
    label: string
    help?: string
    link?: string
  }

  interface ISettingButton {
    key: string
    type: cellViewType.button | cellViewType.buttonWithInput
    label: string
    help?: string
    // button 的 link 不起作用
    link?: string
    option?: string[]
  }
  interface ISettingSelect {
    key: string
    type: cellViewType.select | cellViewType.muiltSelect
    label: string
    option: string[]
    help?: string
    link?: string
  }
  interface ISettingSwitch {
    key: string
    type: cellViewType.switch
    label: string
    help?: string
    link?: string
  }

  type IAction = IRowButton

  // 生成的 DataSource
  interface ISection {
    header: string
    rows: Array<IRow>
  }

  type IRow = IRowPlainText | IRowSwitch | IRowInput | IRowButton | IRowSelect

  interface IRowPlainText {
    type: cellViewType.plainText
    label: string
    link: string
  }

  interface IRowSwitch {
    type: cellViewType.switch
    key: string
    status: boolean
    label: string
  }

  interface IRowInput {
    type: cellViewType.input | cellViewType.inlineInput
    key: string
    content: string
    label: string
  }

  interface IRowButton {
    type: cellViewType.button | cellViewType.buttonWithInput
    key: string
    label: string
    help?: string
    option?: string[]
  }

  interface IRowSelect {
    type: cellViewType.select | cellViewType.muiltSelect
    key: string
    label: string
    selections: number[]
    option: string[]
  }

  interface IActionMethod {
    [k: string]: ({
      content,
      nodes
    }: {
      content: string
      nodes: MbBookNote[]
    }) => void
  }
}
