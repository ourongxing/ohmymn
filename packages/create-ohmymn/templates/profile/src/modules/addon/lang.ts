import { i18n } from "marginnote"
import { Addon } from "~/addon"

export default i18n({
  zh: {
    intro: `当前版本：${Addon.version}`,
    double_link: "双击打开链接",
    profile: {
      $option5: [
        "配置 1",
        "配置 2",
        "配置 3",
        "配置 4",
        "初始化"
      ] as StringTuple<5>,
      label: "选择全局配置",
      help: "【仅当前笔记本】不同场景，不同配置。"
    },
    quick_switch: {
      label: "模块快捷开关"
    },
    panel_position: {
      $option6: [
        "文档靠内",
        "文档脑图中间",
        "脑图靠内",
        "靠左",
        "居中",
        "靠右"
      ] as StringTuple<6>,
      label: "面板显示位置"
    },
    panel_height: {
      $option3: ["高点", "标准", "矮点"] as StringTuple<3>,
      label: "面板显示高度"
    },
    panle_control: {
      $option2: ["双击图标打开面板", "动作执行完关闭面板"] as StringTuple<2>,
      label: "面板显示控制"
    },
    drag_merge: {
      label: "拖拽合并生成标题",
      help: "【可以生成标题的模块】如果卡片中有摘录，使用手型工具拖拽选区合并到该卡片中。",
      $option2: [
        "始终不生成标题",
        "满足条件时生成标题",
        "始终转标题"
      ] as StringTuple<3>
    },
    has_title_then: {
      $option3: ["不转标题", "合并标题", "覆盖标题"] as StringTuple<3>,
      label: "> 已经有标题"
    },
    remove_excerpt: {
      $option2: ["立即删除", "等会删除"] as StringTuple<2>,
      label: "> 拖入的摘录将"
    },
    lock_excerpt: {
      label: "锁定摘录文字"
    },
    auto_backup: {
      label: "自动备份配置"
    },
    backup_ID: {
      help: "输入备份卡片链接，请确保该卡片有子卡片，否则无法写入。子卡片越多越好。",
      not_link: "不是卡片链接",
      not_exit: "卡片不存在",
      no_child: "卡片没有子卡片"
    }
  },

  en: {
    intro: `Current Version: ${Addon.version}`,
    double_link: "Double Click to Open Link",
    profile: {
      $option5: [
        "Profile 1",
        "Profile 2",
        "Profile 3",
        "Profile 4",
        "Initialize"
      ],
      label: "Select Global Profile",
      help: "[Only Current Notebook] Different Scenes, Different Profile."
    },
    quick_switch: {
      label: "Module Quick Switch"
    },
    panel_position: {
      $option6: [
        "Document Inner Side",
        "Document MindMap Middle",
        "MindMap Inner Side",
        "Left",
        "Center",
        "Right"
      ],
      label: "Panel Position"
    },
    panel_height: {
      $option3: ["Taller", "Standard", "Shorter"],
      label: "Panel Height"
    },
    panle_control: {
      $option2: ["Double Click Icon to Open Panel", "Close Panel After Action"],
      label: "Panel Control"
    },
    drag_merge: {
      label: "Drag Merge to Generate Title",
      help: "[Modules that can generate titles] If the card has an excerpt, use the hand tool to drag the selection area to merge into the card.",
      $option2: [
        "Never Generate Title",
        "Always Generate Title",
        "Generate Title When Conditions Are Met"
      ]
    },
    has_title_then: {
      $option3: ["Not Turn to Title", "Merge Title", "Override Title"],
      label: "> Has Title"
    },
    remove_excerpt: {
      $option2: ["Remove Immediately", "Remove Later"],
      label: "> The Dragged Excerpt Will"
    },
    lock_excerpt: {
      label: "Lock Excerpt Text"
    },
    auto_backup: {
      label: "Auto Backup Profile"
    },
    backup_ID: {
      help: "Enter the backup card link, please make sure that the card has subcards, otherwise it cannot be written. The more subcards, the better.        ",
      not_link: "Not a card url",
      not_exit: "Card does not exist",
      no_child: "Card has no subcards"
    }
  }
})
