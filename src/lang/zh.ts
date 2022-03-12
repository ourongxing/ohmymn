const dict = {
  handle_received_event: {
    input_saved: "输入已保存",
    input_clear: "输入已清空",
    auto_correct:
      "自动矫正和锁定摘录无法同时正常工作，请关闭任意一个，否则会出现意想不到的问题",
    lock_excerpt:
      "锁定摘录和自动矫正无法同时正常工作，请关闭任意一个，否则会出现意想不到的问题"
  },
  magic_action_handler: {
    not_selected: "未选中任何脑图卡片",
    smart_select: {
      title: "OhMyMN 智能选择",
      option: [
        "仅处理选中的卡片",
        "仅处理子节点",
        "仅处理所有后代节点",
        "处理选中的卡片及其后代节点"
      ],
      card_with_children: "检测到您选中的唯一卡片有子节点",
      cards_with_children: "检测到您选中的多张同层级卡片均有子节点"
    }
  },
  magicaction_from_which_module: (module: string) =>
    `该动作来自于 ${module}，与其使用相同的配置`,
  switch_panel: {
    better_with_mindmap: "OhMyMN 与脑图更配喔"
  },
  handle_user_action: {
    sure: "确定",
    input_error: "输入错误，请重新输入",
    gesture: {
      alert:
        "该功能打开后，OhMyMN 会监测在脑图卡片单选和多选工具栏上的滑动，并触发您设定的动作。\n该功能由 OhMyMN 提供，与 MarginNote 无关。请问您是否详细阅读使用文档，并知晓具体手势监测区域和相关使用风险",
      option: ["不清楚，查看文档", "我已知晓"],
      doc: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8"
    }
  },
  implement_datasource_method: {
    none: "无",
    open_panel: "打开控制面板"
  },
  addon_life_cycle: {
    remove: "OhMyMN 已停用，配置已重置"
  },
  profile_manage: {
    success: "配置读取成功",
    fail: "配置读取失败",
    not_find: "未找到配置信息",
    prohibit: "「OhMyMN」配置（禁止直接修改）"
  },
  network: {
    null: "没有收到返回值，请检测网络",
    notJSON: "返回值不是 JSON 格式"
  },
  handle_gesture_event: {
    action_not_work: "未启用，该动作无法执行"
  },
  cancel: "取消",
  more: {
    donate: "如果 OhMyMN 对你有所帮助，欢迎赞赏，点击即可直达二维码。",
    mn5: "由于 MN5 会重新设计插件系统，在 MN5 发布前 OhMyMN 将不再更新。"
  }
}

export default dict
