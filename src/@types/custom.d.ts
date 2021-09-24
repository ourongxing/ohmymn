export {}
declare global {
  const enum cellViewType {
    plainText = 0,
    switch = 1,
    button = 2,
    buttonWithInput = 3,
    input = 4,
    inlineInput = 5,
  }

  // 配置文件
  interface IConfig {
    name: string
    intro: string
    link?: string
    settings: Array<ISetting>
    /**
     * 快捷方式，放在第一个 Section ，方便点击
     */
    actions: Array<IAction>
  }

  interface ISetting {
    key: string
    type: cellViewType
    label?: string
    help?: string
    link?: string
  }

  interface IAction {
    key: string
    type: cellViewType.button | cellViewType.buttonWithInput
    label: string
    // action 中的 help 现在在弹窗中，setting 中的 help 显示在上方
    help?: string
  }

  // 生成的 DataSource
  interface ISection {
    header: string
    rows: Array<IRow>
  }

  interface IRow {
    type: cellViewType
    // !plaintext
    key?: string
    // !input
    label?: string
    // plaintext
    link?: string
    // switch
    status?: boolean
    // input or inlineInput
    content?: string
    // buttonWithInput
    help?: string
  }
  interface IActionMethod {
    [k: string]: ({
      content,
      nodes,
    }: {
      content: string
      nodes: MbBookNote[]
    }) => void
  }
}
