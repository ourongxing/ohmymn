const config: IConfig = {
  name: "OhMyMN",
  intro: "Github 投票征集新的需求\nMade with 💖 By @ourongxing（点击跳转）",
  link: "https://github.com/ourongxing",
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
      help: "下列三项仅当前笔记本生效",
      key: "defaultFullWidth",
      type: cellViewType.switch,
      label: "默认使用全角符号"
    },
    {
      help: "开启后会对框选的摘录执行处理",
      key: "autoOCR",
      type: cellViewType.switch,
      label: "是否开启了选框自动 OCR",
    },
    {
      help: "开启后会在矫正后重新处理",
      key: "autoCorrect",
      type: cellViewType.switch,
      label: "是否开启了自动在线矫正",
    }

  ],
  actions: [
  ]
}

const util = {
  removeRepeat(text: string): string {
    for (const char of `！!。，, `) {
      const reg = new RegExp(`${char}{2,}`, "g")
      text = text.replace(reg, char)
    }
    return text
  },
  toFullWidth(text: string): string {
    const fullIndex = [
      33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 58, 59, 60,
      61, 62, 63, 64, 91, 92, 93, 94, 95,
      96, 91, 92, 93, 94, 95, 96, 123, 124,
      125, 126
    ]
    let tmp = "";
    for (const char of text) {
      if (fullIndex.includes(char.charCodeAt(0))) {
        tmp = tmp + String.fromCharCode(char.charCodeAt(0) + 65248);
      }
      else tmp = tmp + char
    }
    // 删除所有空格和重复符号
    return this.removeRepeat(tmp).replace(/\s+/g, "")
  },
}
const action = {}
export default { config, util, action }