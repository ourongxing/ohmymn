const config: IConfig = {
  name: "OhMyMN",
  intro: "version: 1.1.0 beta 3 \nmade by @ourongxing",
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      key: "panelPostion",
      type: cellViewType.select,
      option: ["靠左", "中间", "靠右"],
      label: "面板显示位置"
    },
    {
      key: "panelHeight",
      type: cellViewType.select,
      option: ["高点", "标准", "矮点"],
      label: "面板显示高度"
    },
    {
      key: "doubleClick",
      type: cellViewType.switch,
      label: "双击打开面板"
    },
    {
      key: "clickHidden",
      type: cellViewType.switch,
      label: "自动关闭面板"
    },
    {
      key: "lockExcerpt",
      type: cellViewType.switch,
      label: "锁定摘录文字"
    },
    {
      help: "【当前文档生效】开启后会在矫正后执行处理",
      key: "autoCorrect",
      type: cellViewType.switch,
      label: "自动在线矫正"
    }
  ],
  actions: []
}

const util = {}
const action = {}
export default { config, util, action }
