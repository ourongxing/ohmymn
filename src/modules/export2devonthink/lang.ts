import { MN } from "~/const"

const zh = {
  intro: "导出卡片信息到Devonthink中",
  link: "",
  lable: {
    export_method: "下载or导出",
    show_template: "显示/隐藏所有模板",
    add_tags: "添加标签",
    actions_card: "导出到Devonthink"
  },
  option: {
    add_tags: ["无", "仅卡片中的标签", "自定义标签模板"]
  },
  help: {
    title: "标题",
    comment: "评论",
    add_tags: "固定添加在最后",
    tags: "标签模版，点击查看支持的变量。",
    destination: "目标文件夹(输入对应文件夹UUID)",
    html_source: "URL。用于下载为HTML文件(请务必加上http或者https)",
    pdf_source: "URL。用于下载为PDF文件(请务必加上http或者https)",
    md_text: "正文文本",
    tx_text: "正文文本",
    hide: "隐藏(1/0)",
    referrer: "URL链接(用于引用)",
    width: "宽度",
    paginated: "分页(1/0)"
  },
  hud: {
    actions_card: "模版对应的内容为空"
  }
}
const en: typeof zh = {
  intro: "",
  link: "",
  lable: {
    export_method: "Download or Export",
    show_template: "Show/Hide all Templates",
    add_tags: "Add Tags",
    actions_card: "Export to Devonthink"
  },
  option: {
    add_tags: ["None", "Only Card Tags", "Custom"]
  },
  help: {
    title: "Title",
    comment: "Comment",
    add_tags: "Add at the End",
    tags: "Tags Template. Click to see supported variables.",
    destination: "Destination Folder(Input the folder UUID)",
    html_source: "URL. Use to download as HTML file(Please add http or https)",
    pdf_source: "URL. Use to download as PDF file(Please add http or https)",
    md_text: "The text content for documents",
    tx_text: "The text content for documents",
    hide: "Hide(1/0)",
    referrer: "The URL that referred to the item (URL)",
    width: "The Page Width ",
    paginated: "Paginate the created PDF(1/0)"
  },
  hud: {
    actions_card: "The content of the template is empty"
  }
}

export const lang = MN.isZH ? zh : en
