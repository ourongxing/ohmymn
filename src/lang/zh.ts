import { Addon } from "const"

const dict = {
  input_saved: "输入已保存",
  input_clear: "输入已清空",
  input_error: "格式错误，请重新输入",
  open_panel: "打开控制面板",
  none: "无",
  sure: "确定",
  cancel: "取消",
  make_sure_autoocr: "请确保 AutoOCR 已启用，并且输入了 Key，否则没有效果！",
  disconnect_addon: `${Addon.title} 已停用，配置已重置`,
  action_not_work: "未启用，该动作无法执行",
  not_select_card: "未选中任何脑图卡片",
  not_select_text: "没有框选任何文字",
  no_text_selection: "无法得到到选中区域的文字",
  no_profile_in_card: "卡片中不存在配置信息",
  input_number: "请输入数字",
  input_integer: "请输入整数",
  input_positive: "请输入正整数",
  smart_select: {
    title: `${Addon.title} 智能选择`,
    option: [
      "仅处理选中的卡片",
      "仅处理子节点",
      "仅处理所有后代节点",
      "处理选中的卡片及其后代节点"
    ],
    card_with_children: "检测到您选中的唯一卡片有子节点",
    cards_with_children: "检测到您选中的多张同层级卡片均有子节点"
  },
  magicaction_from_which_module: (module: string) =>
    `该动作来自于 ${module}，与其使用相同的配置`,
  handle_user_action: {
    gesture: {
      alert:
        "该功能打开后，OhMyMN 会监测在脑图卡片单选和多选工具栏上的滑动，并触发您设定的动作。\n该功能由 OhMyMN 提供，与 MarginNote 无关。请问您是否详细阅读使用文档，并知晓具体手势监测区域和相关使用风险",
      option: ["不清楚，查看文档", "我已知晓"],
      doc: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8"
    }
  },
  profile_manage: {
    success: "配置读取成功",
    fail: "配置读取失败",
    not_find: "未找到配置信息",
    prohibit: `「${Addon.title}」配置（禁止直接修改）`
  }
}

export default dict
