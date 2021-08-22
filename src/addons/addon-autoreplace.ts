const config: IConfig = {
  name: "AutoReplace",
  intro: "自动替换摘录中的某些错误",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
    {
      key: "customReplace",
      type: cellViewType.input,
      help: "自定义，点击查看具体格式",
      link: "https://github.com/ourongxing",
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "替换摘录文字",
      key: "replaceChecked",
      help: `参考 JS 的 replace 语法\n格式：("匹配","替换");()`
    }
  ]
}

const util = {}
const action = {}
export default { config, util, action }
