import { Dict } from "lang"

const dict = {
  addon: {
    ohmymn: {
      option: {
        profile: "Profile",
        panel_position: ["Auto", "Left", "Center", "Right"],
        panel_height: ["Higher", "Standard", "Lower"]
      },
      label: {
        quick_switch: "Quick Switch",
        profile: "Choose Profile",
        panel_position: "Panel Position",
        panel_height: "Panel Height",
        double_click: "Double-click to Open the Panel",
        click_hidden: "Auto Close Panel",
        screen_always_on: "Keep Screen Always On",
        lock_excerpt: "Lock Excerpt Text",
        auto_correct: "Auto Correct Excerpt Text Online"   
      },
      help: {
        profile: "[Current Document Takes Effect] Can be used in different scenarios",
        auto_correct: "[Current Document Takes Effect] After opening, it will be processed after auto-correction"
      }
    },
    gesture: {
      intro: "Custom Gestures to Trigger Actions",
      singleBar: "Single Selection Toolbar",
      muiltBar: "Multi Selection Toolbar"
    },
    anotherautodef: {
      intro:
        "Extract the defined terms and any other content as title or title link\n Definition = Defined Term + Connective of Definition + Definiens", //Question:有待商议
      link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22", //Todo:修改英文版Notion
      label: {
        only_desc: "Excerpts only keep definiens",
        to_title_link: "Convert alias to title link",
        custom_split_name: "Customize alias participle, click to view specific format",
        preset: "Choose the desired preset",
        custom_split: "Customize connective of definition, click to view the specific format",
        custom_def_title: "Customize extract content, click to view specific format",
        extraTitle: "Extract title from card"
      },
      option: {
        preset: [
          "Custom Extraction",
          "Custom Connective of Definition",
          "xxx : yyy",
          "xxx —— yyy",
          "xxx ，是(指) yyy",  //Todo:由开发者定
          "xxx 是(指)，yyy",  //Todo:由开发者定
          "xxx 是指 yyy"  //Todo:由开发者定
        ]
      }
    },
    magicaction: {
      intro:
        "Please note that the following functions are used after selecting the card.\n Click to view specific usage and precautions", 
      link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
      option: {
        filter_cards: ["Detect Only Title", "Detect Entire Card"],
        change_fill_style: ["Frame+Color Fill", "Color Fill", "Frame"],
        merge_text: ["Merged as Excerpt", "Merged as Comment"],
        merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"]
      },
      help: {
        filter_cards: "Please see the help document for more precautions and specific input format",
        change_color: "输入颜色索引，也就是顺序，1 到 16",
        merge_text: "输入分隔符，注意事项及具体输入格式见顶上帮助信息",
        rename_title: "注意事项及具体输入格式见顶上帮助信息"
      },
      label: {
        filter_cards: "筛选卡片",
        change_fill_style: "修改摘录样式",
        change_color: "修改摘录颜色",
        merge_cards: "合并多张卡片",
        merge_text: "合并卡片内文字",
        rename_title: "批量重命名标题"
      },
      hud: {
        is_clicked: "您需要的卡片已选中，请继续操作",
        none_card: "未找到符合的卡片"
      }
    },
    autostandardize: {
      intro: "优化摘录和标题的排版与格式\nPowerd by Pangu.js",
      option: {
        preset: [
          "半角转全角",
          "中英文加空格",
          "去除重复空格",
          "英文标题规范化"
        ],
        standardize_selected: ["都优化", "仅优化标题", "仅优化摘录"]
      },
      label: {
        standardize_selected: "优化排版和格式",
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
        replace_selected: "批量替换摘录文字",
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
        custom_complete: "自定义摘录填充信息，点击查看支持变量",
        complete_selected: "补全单词词形"
      },
      option: {
        complete_selected: ["仅补全单词词形", "同时填充单词信息"]
      },
      error: {
        not_find_word: "查询不到该单词"
      }
    },
    anotherautotitle: {
      intro: "更强大的自动转换标题插件",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6",
      option: {
        has_title_then: ["作为摘录", "标题链接", "覆盖标题"],
        preset: ["自定义", "字数限制", "不含有点号"],
        switch_title: ["切换为不存在的", "交换标题和摘录"]
      },
      label: {
        has_title_then: "标题存在，继续摘录",
        change_title_no_limit: "拓宽标题摘录不受限制",
        preset: "选择需要的预设",
        custom_be_title: "自定义，点击查看具体格式",
        switch_title: "切换摘录或标题",
        word_count: "设定最多字数"
      },
      help: {
        has_title_then: "也要先满足预设条件",
        switch_title: "当两者都存在时请使用「交换标题和摘录」"
      }
    },
    more: {
      donate: "如果 ohmymn 对你有所帮助，欢迎赞赏，点击即可直达二维码。",
      github:
        "ohmymn 完全开源，容易扩展，欢迎参与开发。点击直达 Github 查看源码。",
      feishu:
        "点击加入飞书话题群，一起交流 ohmymn 使用技巧，我会不定期为大家解决疑问。"
    }
  },
  handle_received_event: {
    hud: {
      not_selected: "No mindmap card selected",
      auto_correct: "Please select the switch according to the actual situation, it is not recommended to turn on the automatic correction carelessly",
      lock_excerpt: "it's not recommended to turn on locked excerpts and automatic correction at the same time",
      input_saved: "Input saved",
      input_clear: "Input is cleared"
    },
    smart_select: {
      option: [
        "Process only selected cards",
        "Process all child nodes",
        "Process child nodes and seected cards"
      ],
      card_with_children: "Detect only one selected card has child nodes",
      cards_with_children: "Detect all selected cards of the same level have child nodes"
    }
  },
  switch_panel: {
    better_with_mindmap: "OhMyMN is more compatible with mindmap"
  },
  handle_user_action: {
    sure: "Confirm",
    input_error: "Input errors, please re-enter"
  },
  implement_datasource_method: {
    none: "None",
    clicked: "Selected"
  }
}

export default dict
