import { MN } from "~/marginnote/sdk"
import { doc } from "~/utils"

const zh = {
  intro: "所有动作均需要先选中卡片。点击查看具体的使用方法和注意事项。",
  default_merge_text: {
    help: "合并卡片内文字时的前后修饰，默认添加序号和换行（$&代表每一段），点击查看自定义方法。                 ",
    error: "缺少 $&",
    link: doc("magicaction4card", "合并卡片内文字")
  },
  rename_title: {
    label: "重命名标题",
    help: `$& 指代原标题。输入 "%['1'] $&" 可快速为选中卡片标题编号。`
  },
  smart_selection: {
    label: "智能选择",
    help: "帮助你快速选中子卡片，后代卡片"
  },
  filter_cards: {
    label: "筛选卡片",
    $option5: ["所有", "标题", "摘录", "评论", "标签"] as StringTuple<5>
  },
  switch_title: {
    label: "切换摘录标题",
    help: "当两者都存在时请使用「交换标题和摘录」",
    $option2: ["切换为不存在的", "交换标题和摘录"] as StringTuple<2>
  },
  merge_text: {
    label: "合并卡片内文字",
    help: "仅支持合并文字摘录和文字评论，不合并标签和链接，其余内容会在合并后置顶",
    is_excerpt_pic_text:
      "检测到当前摘录为图片 OCR 的文字，合并为评论无法删除该摘录，是否继续合并为评论？",
    $excerpt_pic_text_option2: ["继续", "合并为评论"] as StringTuple<2>,
    is_excerpt_pic:
      "检测到当前摘录为图片，合并为摘录后仍旧是图片，是否继续合并为摘录？",
    $excerpt_pic_option2: ["继续", "合并为评论"] as StringTuple<2>,
    $option2: ["合并为摘录", "合并为评论"] as StringTuple<2>
  },
  merge_cards: {
    label: "合并卡片",
    $option2: ["同时合并标题", "不合并标题"] as StringTuple<2>
  },
  manage_profile: {
    label: "配置管理",
    $option4: [
      "读取配置",
      "写入配置",
      "重置配置",
      "同步其他窗口的配置"
    ] as StringTuple<4>,
    help: "写入配置时请确保该卡片至少有一张子卡片。多张子卡片可以一起分担配置，防止单张卡片字数过多。"
  },
  is_selected: "您需要的卡片已选中，请继续操作",
  none_card: "未找到符合的卡片",
  hierarchical_numbering: "请确保选中的每张卡片均为同层级且都有子卡片"
}

const en: typeof zh = {
  intro:
    "All actions need to select the card first. Click for the specific useage",
  smart_selection: {
    label: "Smart Selector",
    help: "Help you quickly select the child card and descendant card"
  },
  default_merge_text: {
    help: "The default prefix and suffix of the merged text. Click to see the custom method.                 ",
    error: "Missing $&",
    link: doc("magicaction4card", "合并卡片内文字")
  },
  switch_title: {
    help: "Use [Swap Title and Excerpt] when both are present」",
    label: "Switch Excerption or Title",
    $option2: ["Switch to Non-Existent", "Swap Title and Excerpt"]
  },
  filter_cards: {
    label: "Filter Cards",
    $option5: ["All", "Title", "Excerpt", "Comment", "Tag"]
  },
  merge_text: {
    label: "Merge Text",
    is_excerpt_pic_text:
      "The current excerpt is a picture OCR text. If you merge it as a comment, you cannot delete the excerpt. Do you want to continue to merge it as a comment?",
    $excerpt_pic_text_option2: ["Continue", "Merge as Comment"],
    help: "Only support merging text excerpt and text comment, not merging tags and link, other content will be pinned after merging",
    $excerpt_pic_option2: ["Continue", "Merge as Comment"],
    is_excerpt_pic: "The excerpt is a picture, continue to merge as excerpt?",
    $option2: ["Merged as Excerpt", "Merged as Comment"]
  },
  merge_cards: {
    label: "Merge Multiple Cards",
    $option2: ["Merge Title", "Not Merge Titles"]
  },
  manage_profile: {
    label: "Manage Profile",
    $option4: [
      "Read Profile",
      "Write Profile",
      "Reset Profile",
      "Sync Profile with Other Windows"
    ],
    help: "Please make sure that the card has at least one child card when writing the profile. Multiple child cards can share the profile together to prevent a single card from having too many words."
  },
  rename_title: {
    help: `$& refers to the original title. Enter "%['1'] $&" to Quickly number the selected card title.`,
    label: "Rename Titles"
  },
  is_selected: "The card is selected, please continue",
  none_card: "No matching cards found",
  hierarchical_numbering:
    "Ensure that each selected card is at the same level and has child node"
}

export const lang = MN.isZH ? zh : en
