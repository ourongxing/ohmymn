import { MN } from "~/sdk"

const zh = {
  intro: "所有动作均需要先选中卡片。点击查看具体的使用方法和注意事项。",
  link: "https://ohmymn.marginnote.cn/guide/modules/magicaction4card.html",
  option: {
    filter_cards: ["所有", "标题", "摘录", "评论", "标签"] as Tuple<string, 5>,
    switch_title: ["切换为不存在的", "交换标题和摘录"],
    merge_text: ["合并为摘录", "合并为评论"],
    merge_cards: ["同时合并标题", "不合并标题"],
    manage_profile: ["读取配置", "写入配置"] as Tuple<string, 2>
  },
  help: {
    merge_text: "输入分隔符",
    switch_title: "当两者都存在时请使用「交换标题和摘录」",
    rename_title: "现在可以分层进行编号",
    manage_profile:
      "请确保该卡片至少有一张子卡片！多张子卡片可以一起分担配置，防止单张卡片字数过多。"
  },
  label: {
    switch_title: "切换摘录标题",
    filter_cards: "筛选卡片",
    merge_cards: "合并卡片",
    merge_text: "合并卡片内文字",
    rename_title: "重命名标题",
    manage_profile: "配置管理",
    smart_selection: "智能选择"
  },
  hud: {
    is_clicked: "您需要的卡片已选中，请继续操作",
    none_card: "未找到符合的卡片",
    hierarchical_numbering: "请确保选中的每张卡片均为同层级且都有子卡片"
  }
}

const en: typeof zh = {
  intro:
    "All actions need to select the card first. Click for the specific useage",
  link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734",
  option: {
    switch_title: ["Switch to Another", "Swap Title and Excerpt"],
    filter_cards: ["All", "Title", "Excerpt", "Comment", "Tag"],
    merge_text: ["Merged as Excerpt", "Merged as Comment"],
    merge_cards: ["Merge Title", "Not Merge Titles"],
    manage_profile: ["Read Profile", "Write Profile"]
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
    manage_profile: "Profile Management"
  },
  hud: {
    is_clicked: "The card is selected, please continue",
    none_card: "No matching cards found",
    hierarchical_numbering:
      "Ensure that each selected card is at the same level and has child node"
  }
}

export const lang = MN.isZH ? zh : en
