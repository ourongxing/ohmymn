const config: IConfig = {
  name: "AutoList",
  intro: "针对有序号的文本，自动换行",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
    {
      key: "multipleChoiceEnhance",
      type: cellViewType.switch,
      label: "选择题增强"
    },
    {
      key: "wrapWhenSemicolon",
      type: cellViewType.switch,
      label: "见分号换行"
    },
    {
      key: "customList",
      type: cellViewType.input,
      help: "自定义，点击查看具体格式",
      link: "https://github.com/ourongxing",
    }
  ],
  actions: [
    {
      type: cellViewType.button,
      label: "序列摘录自动换行",
      key: "listChecked"
    }
  ]
}

const util = {}
const action: IActionMethod = {
  listChecked({ nodes }) {
    const thisNode = nodes[0]
    thisNode.removeCommentByIndex(0)
  }
}
export default { config, util, action }
