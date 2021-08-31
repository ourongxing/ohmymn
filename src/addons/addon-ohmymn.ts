const config: IConfig = {
  name: "OhMyMN",
  intro: "version: beta 0.9.5 \nmade by @ourongxing",
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      key: "rightMode",
      type: cellViewType.switch,
      label: "面板置于右侧"
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
      help: "下列两项仅当前文档生效\n开启后会对框选的摘录执行处理",
      key: "autoOCR",
      type: cellViewType.switch,
      label: "是否开启了选框自动 OCR",
    },
    {
      help: "开启后会在矫正后执行处理",
      key: "autoCorrect",
      type: cellViewType.switch,
      label: "是否开启了自动在线矫正",
    }

  ],
  actions: [
  ]
}

const util = { }
const action = { }
export default { config, util, action }