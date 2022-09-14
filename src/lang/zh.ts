import { Addon } from "~/addon"

const dict = {
  input_saved: "输入已保存",
  input_clear: "输入已清空",
  input_error: "格式错误，请重新输入",
  open_panel: "切换控制面板",
  none: "无",
  sure: "确定",
  uninstall: {
    $options2: ["重置配置", "去论坛更新/反馈"],
    profile_reset: "配置已重置",
    have_bugs: "遇到 Bug 了吗？可以尝试重置配置或者更新到最新版本。"
  },
  action_not_work: "模块未启用，该动作无法执行",
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
    $option4: [
      "仅处理选中的卡片",
      "仅处理子卡片",
      "仅处理所有后代卡片",
      "处理选中的卡片及其后代卡片"
    ],
    card_with_children: "检测到您选中的唯一卡片有子卡片",
    cards_with_children: "检测到您选中的多张同层级卡片均有子卡片"
  },
  magicaction_from_which_module: (module: string) =>
    `该动作来自于 ${module}，与其使用相同的设置`,
  handle_user_action: {
    gesture: {
      alert:
        "该功能由 OhMyMN 提供，与 MarginNote 无关。请问您是否详细阅读使用文档，并知晓具体手势监测区域和相关使用风险",
      option: ["不清楚，查看文档", "我已知晓"],
      doc: "https://ohmymn.marginnote.cn/guide/modules/gesture.html"
    }
  },
  more: {
    website: "OhMyMN 官网：ohmymn.marginnote.cn",
    core_team: "核心开发团队：ourongxing，Bryan",
    intro:
      "OhMyMN 是 MarginNote 插件控制面板及开发框架。OhMyMN 完全开源，官方支持，欢迎参与。"
  }
}

export default dict
