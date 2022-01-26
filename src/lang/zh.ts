const dict = {
  module: {
    ohmymn: {
      link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
      option: {
        profile: "配置",
        has_title_then: ["作为摘录", "标题链接", "覆盖标题"],
        panel_position: ["自动", "靠左", "居中", "靠右"],
        panel_height: ["高点", "标准", "矮点"],
        panle_control: [
          "双击 Logo 打开面板",
          "双击面板关闭面板",
          "Action 执行完关闭面板"
        ]
      },
      label: {
        has_title_then: "标题存在，继续摘录",
        quick_switch: "插件快捷开关",
        profile: "选择配置文件",
        panel_position: "面板显示位置",
        panel_height: "面板显示高度",
        panle_control: "面板开启关闭",
        screen_always_on: "保持屏幕常亮",
        lock_excerpt: "锁定摘录文字",
        auto_correct: "开启自动在线矫正了吗"
      },
      help: {
        profile: "【当前文档生效】可用于不同情景",
        has_title_then: "如果可以转为标题，则",
        auto_correct: "【当前文档生效】开启后会在矫正后执行处理"
      }
    },
    gesture: {
      intro: "自定义手势触发动作",
      link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
      singleBar: "单选工具栏",
      muiltBar: "多选工具栏"
    },
    anotherautodef: {
      intro:
        "提取被定义项或任意内容为标题或标题链接\n定义 = 被定义项 + 定义联项 + 定义项",
      link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22",
      label: {
        only_desc: "摘录仅保留定义项",
        to_title_link: "别名转为标题链接",
        preset: "选择需要的预设",
        title_link_split: "选择别名分词",
        custom_title_split: "自定义别名分词，点击查看具体格式",
        custom_def_link: "自定义定义联项，点击查看具体格式",
        custom_extract_title: "自定义提取内容，点击查看具体格式",
        extract_title: "从卡片中提取标题"
      },
      option: {
        title_link_split: ["自定义", "默认", "标点符号"],
        preset: [
          "自定义提取内容",
          "自定义定义联项",
          "xxx : yyy",
          "xxx —— yyy",
          "xxx ，是(指) yyy",
          "xxx 是(指)，yyy",
          "xxx 是指 yyy",
          "yyy，___称(之)为 xxx",
          "yyy(被)称(之)为 xxx"
        ],
        extract_title: ["使用 AutoDef 中的配置", "确定"]
      }
    },
    magicaction: {
      intro:
        "请注意，以下功能均为选中卡片后使用\n点击查看具体使用方法和注意事项",
      link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
      option: {
        filter_cards: ["仅筛选标题", "筛选整个卡片内容"],
        merge_text: ["合并为摘录", "合并为评论"],
        merge_cards: ["同时合并标题", "不合并标题"],
        manage_profile: ["读取配置信息", "写入配置信息"]
      },
      help: {
        filter_cards: "注意事项及具体输入格式见顶上帮助信息",
        merge_text: "输入分隔符，注意事项及具体输入格式见顶上帮助信息",
        rename_title: "注意事项及具体输入格式见顶上帮助信息",
        manage_profile: "禁止直接修改配置信息，读取后会覆盖现有配置"
      },
      label: {
        filter_cards: "筛选卡片",
        merge_cards: "合并卡片",
        merge_text: "合并卡片文字",
        rename_title: "重命名标题",
        manage_profile: "配置管理"
      },
      hud: {
        is_clicked: "您需要的卡片已选中，请继续操作",
        none_card: "未找到符合的卡片"
      }
    },
    autostandardize: {
      intro: "优化摘录和标题的排版与格式",
      link: "https://busiyi.notion.site/AutoStandrize-b5e0d381d4814139a1b73d305ebc12d1",
      option: {
        preset: [
          "自定义",
          "去除全部空格",
          "半角转全角",
          "中英文加空格",
          "去除中文间空格",
          "去除重复空格"
        ],
        standardize_selected: ["都优化", "仅优化标题", "仅优化摘录"]
      },
      help: {
        standardize_title: "点击查看具体规范"
      },
      label: {
        standardize_selected: "优化排版格式",
        standardize_title: "英文标题规范化",
        custom_standardize: "自定义，点击查看具体格式",
        preset: "选择需要的预设"
      }
    },
    autoreplace: {
      intro: "自动替换摘录中的某些错误",
      link: "https://busiyi.notion.site/AutoReplace-23df00035c97436e88a863925a08e57f",
      option: {
        preset: ["自定义"],
        replace_selected: ["使用 AutoReplace 的配置", "确定"]
      },
      help: {
        replace_selected: "具体输入格式见顶上帮助信息"
      },
      label: {
        preset: "选择需要的预设",
        replace_selected: "替换摘录文字",
        custom_replace: "自定义，点击查看具体格式"
      }
    },
    autolist: {
      intro: "针对序列文本，自动换行，仅适配中文",
      link: "https://busiyi.notion.site/AutoList-4c52b2607225450f913a6bfaba1f15ec",
      option: {
        preset: ["自定义", "选择题", "句首中文编号", "句末分号", "句末句号"],
        list_selected: ["使用 AutoList 的配置", "确定"]
      },
      help: {
        list_selected: "具体输入格式见顶上帮助信息"
      },
      label: {
        preset: "选择需要的预设",
        custom_list: "自定义，点击查看具体格式",
        list_selected: "序列摘录换行"
      }
    },
    autocomplete: {
      intro: "补全单词词形，只支持动词和名词",
      link: "https://busiyi.notion.site/AutoComplete-1eab78ee6d7648339e088c593326b5ca",
      label: {
        fill_word_info: "填充单词信息",
        custom_fill: "自定义单词填充信息，点击查看支持变量",
        complete_selected: "补全单词词形"
      },
      option: {
        complete_selected: ["仅补全单词词形", "同时填充单词信息"],
        fill_word_info: ["不填充", "自定义", "中文含义"]
      },
      error: {
        not_find_word: "查询不到该单词",
        forbid: "为减小服务器压力，禁止同时处理超过 5 张卡片"
      }
    },
    anotherautotitle: {
      intro: "更强大的自动转换标题插件",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6",
      option: {
        preset: ["自定义", "根据字数", "不含有点号"],
        switch_title: ["切换为不存在的", "交换标题和摘录"]
      },
      label: {
        change_title_no_limit: "标题摘录始终为标题",
        preset: "选择需要的预设",
        custom_be_title: "自定义，点击查看具体格式",
        switch_title: "切换摘录标题",
        word_count: "[中文字数, 英文单词个数]，没超过就自动设置为标题"
      },
      help: {
        switch_title: "当两者都存在时请使用「交换标题和摘录」",
        change_title_no_limit: "拓宽标题摘录选区，始终转为标题"
      }
    },
    autotag: {
      intro: "自动加标签",
      link: "https://busiyi.notion.site/AutoTag-3a7fc5e0b84e47d18366d4cb60c4943d",
      option: {
        preset: ["自定义"],
        tag_selected: ["使用 AutoTag 的配置", "确定"]
      },
      label: {
        preset: "选择需要的预设",
        custom_tag: "自定义，点击查看具体格式",
        tag_selected: "给卡片加标签"
      }
    },
    autostyle: {
      link: "https://busiyi.notion.site/AutoStyle-008cc0fae7844e7fb171ca948da91cb5",
      intro: "自动修改摘录颜色和样式",
      area: "面积",
      label: {
        preset: "选择需要的预设",
        change_style: "修改摘录样式",
        change_color: "修改摘录颜色",
        show_area: "显示摘录面积",
        default_text_excerpt_color: "文本摘录默认颜色",
        default_pic_excerpt_color: "图片摘录默认颜色",
        default_text_excerpt_style: "文本摘录默认样式",
        default_pic_excerpt_style: "图片摘录默认样式",
        word_count_area:
          "[中文字数, 英文单词个数, 面积]，超过则将摘录样式设置为线框，否则默认"
      },
      help: {
        change_color: "输入颜色索引，也就是顺序，1 到 16"
      },
      option: {
        change_style: ["使用 AutoStyle 的配置", "线框+填充", "填充", "线框"],
        change_color: ["使用 AutoStyle 的配置", "确定"],
        preset: [
          "样式由字数或面积决定",
          "颜色跟随卡片",
          "颜色跟随第一个兄弟节点",
          "颜色跟随父节点"
        ],
        style: ["无", "线框+填充", "填充", "线框"],
        color: [
          "无",
          "浅黄",
          "浅绿",
          "浅蓝",
          "浅红",
          "黄",
          "绿",
          "蓝",
          "红",
          "橘",
          "深绿",
          "深蓝",
          "深红",
          "白",
          "浅灰",
          "深灰",
          "紫"
        ]
      }
    },
    more: {
      donate: "如果 ohmymn 对你有所帮助，欢迎赞赏，点击即可直达二维码。",
      mn5: "由于 MN5 会重新设计插件系统，在 MN5 发布前 ohmymn 将不再更新。"
    }
  },
  handle_received_event: {
    input_saved: "输入已保存",
    input_clear: "输入已清空",
    auto_correct: "请按实际情况选择开关，不建议无脑打开自动矫正",
    lock_excerpt: "锁定摘录不建议和自动矫正同时开启"
  },
  magic_action_handler: {
    not_selected: "未选中任何脑图卡片",
    smart_select: {
      option: [
        "仅处理选中的卡片",
        "仅处理所有子节点",
        "处理选中的卡片及其子节点"
      ],
      card_with_children: "检测到您选中的唯一卡片有子节点",
      cards_with_children: "检测到您选中的同层级卡片均有子节点"
    }
  },
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
  other: {
    cancel: "取消"
  }
}

export default dict
