import { MN } from "@/const"

const zh = {
  intro: "导出卡片树到Obsidian",
  link: "",
  lable: {
    content_method: "导出内容",
    img_process: "图片处理方式",
    img_size: "图片大小",
    write_method: "写入方式",
    actions_card: "导出大纲到Obsidian"
  },
  option: {
    content_method: [
      "导出包含其所有子节点",
      "导出包含其所有父节点",
      "导出包含其所有父子节点"
    ],
    img_process: ["导出图片", "转为文字"],
    write_method: ["无", "追加", "覆盖"]
  },
  help: {
    img_size: "单位：px",
    vault: "保险库名",
    file_name: "要创建的文件名"
  },
  hud: {
    actions_card: "没有选择任何一张卡片"
  }
}
const en: typeof zh = {
  intro: "Export outline to Obsidian",
  link: "",
  lable: {
    content_method: "Export content",
    img_process: "Image process Method",
    img_size: "Image size",
    write_method: "Write Method",
    actions_card: "Export outline to Obsidian"
  },
  option: {
    content_method: [
      "Export all children nodes",
      "Export all parents nodes",
      "Export all parents and children"
    ],
    img_process: ["Export images", "Convert to text"],
    write_method: ["None", "Append", "Overwrite"]
  },
  help: {
    img_size: "Unit: px",
    vault: "Vault name",
    file_name: "File name to create"
  },
  hud: {
    actions_card: "No card selected"
  }
}

export const lang = MN.isZH ? zh : en
