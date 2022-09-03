import { Addon } from "~/const"

const dict = {
  input_saved: "输入已保存",
  input_clear: "输入已清空",
  input_error: "格式错误，请重新输入",
  open_panel: "切换控制面板",
  none: "无",
  sure: "确定",
  cancel: "取消",
  disconnect_addon: "配置已重置",
  action_not_work: "未启用，该动作无法执行",
  not_select_card: "未选中任何脑图卡片",
  not_select_text: "没有框选任何文字",
  no_text_selection: "无法得到到选中区域的文字",
  no_profile_in_card: "卡片中不存在配置信息",
  input_number: "请输入数字",
  input_integer: "请输入整数",
  input_positive: "请输入正整数",
  copy_success: "复制成功, 快去粘贴吧!",
  smart_select: {
    title: `${Addon.title} 智能选择`,
    option: [
      "仅处理选中的卡片",
      "仅处理子卡片",
      "仅处理所有后代卡片",
      "处理选中的卡片及其后代卡片"
    ],
    card_with_children: "检测到您选中的唯一卡片有子卡片",
    cards_with_children: "检测到您选中的多张同层级卡片均有子卡片"
  },
  magicaction_from_which_module: (module: string) =>
    `该动作来自于 ${module}，与其使用相同的配置`,
  handle_user_action: {
    gesture: {
      alert:
        "该功能由 OhMyMN 提供，与 MarginNote 无关。请问您是否详细阅读使用文档，并知晓具体手势监测区域和相关使用风险",
      option: ["不清楚，查看文档", "我已知晓"],
      doc: "https://ohmymn.vercel.app/guide/modules/gesture.html"
    }
  },
  profile_manage: {
    success: "读取成功",
    fail: "读取失败",
    prohibit: "🚫 禁止直接修改",
    children:
      "请确保该卡片至少有一张子卡片！多张子卡片可以一起分担配置，防止单张卡片字数过多。",
    select: {
      array: [
        "所有配置",
        "全局配置 1",
        "全局配置 2",
        "全局配置 3",
        "全局配置 4",
        "全局配置 5",
        "所有全局配置",
        "文档配置",
        "笔记本配置"
      ],
      message: "选择需要导入的配置"
    }
  }
}

export default dict
