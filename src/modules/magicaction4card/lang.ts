import { MN } from "const"

const zh = {
  intro: "所有动作均需要先选中卡片。点击查看具体的使用方法和注意事项。",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  option: {
    filter_cards: ["仅筛选标题", "筛选整个卡片内容"],
    switch_title: ["切换为不存在的", "交换标题和摘录"],
    merge_text: ["合并为摘录", "合并为评论"],
    merge_cards: ["同时合并标题", "不合并标题"],
    manage_profile: ["读取配置信息", "写入配置信息"]
  },
  help: {
    merge_text: "输入分隔符",
    switch_title: "当两者都存在时请使用「交换标题和摘录」",
    rename_title: "现在可以分层进行编号",
    manage_profile: "禁止直接修改配置信息，读取后会覆盖现有配置"
  },
  label: {
    switch_title: "切换摘录标题",
    filter_cards: "筛选卡片",
    merge_cards: "合并卡片",
    merge_text: "合并卡片文字",
    rename_title: "重命名标题",
    manage_profile: "配置管理",
    smart_selection: "智能选择"
  },
  hud: {
    is_clicked: "您需要的卡片已选中，请继续操作",
    none_card: "未找到符合的卡片",
    hierarchical_numbering: "请确保选中的每张卡片均为同层级且都有子节点"
  }
}

const en: typeof zh = {
  intro:
    "All actions need to select the card first. Click for the specific useage",
  link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734",
  option: {
    switch_title: ["Switch to Another", "Swap Titles and Excerpts"],
    filter_cards: ["Filter Only Title", "Filter Entire Card"],
    merge_text: ["Merged as Excerpt", "Merged as Comment"],
    merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"],
    manage_profile: ["Read Configuration", "Write Configuration"]
  },
  help: {
    switch_title: "Use [Swap Title and Excerpt] when both are present」",
    merge_text: "Input delimiter",
    rename_title: "Now it can be hierarchical numbered",
    manage_profile:
      "It is forbidden to directly modify the configuration information, and the existing configuration will be overwritten after reading"
  },
  label: {
    smart_selection: "Smart Selector",
    switch_title: "Switch Excerption or Title",
    filter_cards: "Filter Cards",
    merge_cards: "Merge Multiple Cards",
    merge_text: "Merge Text in Cards",
    rename_title: "Rename Titles",
    manage_profile: "Configuration Management"
  },
  hud: {
    is_clicked: "The card is selected, please continue",
    none_card: "No matching cards found",
    hierarchical_numbering:
      "Ensure that each selected card is at the same level and has child node"
  }
}

export const lang = MN.isZH ? zh : en
