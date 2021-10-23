export {}

interface LabelType {
  type: cellViewType
  label: string
}

interface KeyLabelType extends LabelType {
  key: string
}

interface ISettingBasic extends KeyLabelType {
  help?: string
  link?: string
}

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

  interface ISettingInput extends ISettingBasic {
    type: cellViewType.input | cellViewType.inlineInput
  }

  interface ISettingButton extends ISettingBasic {
    type: cellViewType.button | cellViewType.buttonWithInput
    /** button 的 link 不起作用 */
    link?: undefined
    option?: string[]
  }

  interface ISettingSelect extends ISettingBasic {
    type: cellViewType.select | cellViewType.muiltSelect
    option: string[]
  }
  interface ISettingSwitch extends ISettingBasic {
    type: cellViewType.switch
  }

  type IAction = IRowButton

  // 生成的 DataSource
  interface ISection {
    header: string
    rows: Array<IRow>
  }

  type IRow = IRowPlainText | IRowSwitch | IRowInput | IRowButton | IRowSelect

  interface IRowPlainText extends LabelType {
    type: cellViewType.plainText
    link: string
  }

  interface IRowSwitch extends KeyLabelType {
    type: cellViewType.switch
    status: boolean
  }

  interface IRowInput extends KeyLabelType {
    type: cellViewType.input | cellViewType.inlineInput
    content: string
  }

  interface IRowButton extends KeyLabelType {
    type: cellViewType.button | cellViewType.buttonWithInput
    help?: string
    option?: string[]
  }

  interface IRowSelect extends KeyLabelType {
    type: cellViewType.select | cellViewType.muiltSelect
    selections: number[]
    option: string[]
  }

  interface IActionMethod {
    [k: string]: ({
      content,
      nodes,
      option
    }: {
      content: string
      nodes: MbBookNote[]
      option: number
    }) => any
  }
}
