import { Addon } from "~/addon"
import { MN } from "~/sdk"

const zh = {
  intro: "所有动作均需要先选中卡片。点击查看具体的使用方法和注意事项。",
  link: "https://ohmymn.marginnote.cn/guide/modules/magicaction4card.html",
  default_merge_text: {
    help: "合并卡片内文字时的前后修饰，默认添加序号和换行（$&代表每一段），点击查看自定义方法。                 ",
    error: "缺少 $&",
    link: "https://ohmymn.marginnote.cn/guide/modules/magicaction4card.html#%E5%90%88%E5%B9%B6%E5%8D%A1%E7%89%87%E5%86%85%E6%96%87%E5%AD%97"
  },
  rename_title: {
    label: "重命名标题",
    help: "现在可以分层进行编号"
  },
  smart_selection: `${Addon.title} 智能选择`,
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
    $option3: ["读取配置", "写入配置", "重置配置"] as StringTuple<3>,
    help: "写入配置时请确保该卡片至少有一张子卡片。多张子卡片可以一起分担配置，防止单张卡片字数过多。"
  },
  is_selected: "您需要的卡片已选中，请继续操作",
  none_card: "未找到符合的卡片",
  hierarchical_numbering: "请确保选中的每张卡片均为同层级且都有子卡片"
}

const en: typeof zh = {
  intro:
    "All actions need to select the card first. Click for the specific useage",
  link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734",
  smart_selection: `${Addon.title} Smart Selector`,
  default_merge_text: {
    help: "The default prefix and suffix of the merged text. Click to see the custom method.                 ",
    error: "Missing $&",
    link: "https://ohmymn.marginnote.cn/guide/modules/magicaction4card.html#%E5%90%88%E5%B9%B6%E5%8D%A1%E7%89%87%E5%86%85%E6%96%87%E5%AD%97"
  },
  switch_title: {
    label: "Use [Swap Title and Excerpt] when both are present」",
    help: "Switch Excerption or Title",
    $option2: ["Switch to Another", "Swap Title and Excerpt"]
  },
  filter_cards: {
    label: "Filter Cards",
    $option5: ["All", "Title", "Excerpt", "Comment", "Tag"]
  },
  merge_text: {
    label: "Input delimiter",
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
    label: "Profile Management",
    $option3: ["Read Profile", "Write Profile", "Reset Profile"],
    help: "Please make sure that the card has at least one child card when writing the profile. Multiple child cards can share the profile together to prevent a single card from having too many words."
  },
  rename_title: {
    help: "Now it can be hierarchical numbered",
    label: "Rename Titles"
  },
  is_selected: "The card is selected, please continue",
  none_card: "No matching cards found",
  hierarchical_numbering:
    "Ensure that each selected card is at the same level and has child node"
}

export const lang = MN.isZH ? zh : en
