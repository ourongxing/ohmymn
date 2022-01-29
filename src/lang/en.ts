import { Dict } from "lang"

const dict: Dict = {
  module: {
    ohmymn: {
      link: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73",
      option: {
        profile: "Profile",
        has_title_then: ["As Comments", "As Title Link", "Override"],
        panel_position: ["Auto", "Left", "Center", "Right"],
        panel_height: ["Higher", "Standard", "Lower"],
        panle_control: [
          "Double Click Logo Open Panel",
          "Double Click Panel to Close",
          "Close Panel after Action"
        ]
      },
      label: {
        has_title_then: "Excerpt While Title Exist",
        quick_switch: "Quick Switch",
        profile: "Choose Profile",
        panel_position: "Panel Position",
        panel_height: "Panel Height",
        panle_control: "Panel ON and OFF",
        screen_always_on: "Keep Screen Always On",
        lock_excerpt: "Lock Excerpt Text",
        auto_correct: "Is Auto-Correct Enabled?"
      },
      help: {
        profile:
          "[Current Document Takes Effect]\nCan be used in different scenarios",
        has_title_then: "If can be turned into a title, then",
        auto_correct:
          "[Current Document Takes Effect]\nAfter opening, it will be processed after auto-correction"
      }
    },
    gesture: {
      intro: "Custom Gestures to Trigger Actions",
      link: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73",
      singleBar: "Single-select Toolbar",
      muiltBar: "Multi-select Toolbar"
    },
    anotherautodef: {
      intro:
        "Extract the defined terms and any other content as title or title link\nDefinition = Defined Term + Connective of Definition + Definiens\n", //Question:有待商议
      link: "https://huangkewei.notion.site/AnotherAutoDef-1852d4876891455681a90864ea35c828", //Todo:修改英文版Notion
      label: {
        only_desc: "Only Keep Definiens",
        to_title_link: "Convert Alias To Title Link",
        custom_title_split:
          "Customize alias participle, click for  specific format",
        title_link_split: "Select Alias Participle",
        preset: "Select Presets",
        custom_def_link:
          "Customize connective of definition, click for  the specific format",
        custom_extract_title:
          "Customize extract content, click for  specific format",
        extract_title: "Extract Title From Card"
      },
      option: {
        title_link_split: ["Custom", "Default", "Punctuation"],
        preset: [
          "Custom Extraction",
          "Custom Connective of Definition",
          "xxx : yyy",
          "xxx —— yyy",
          "xxx ，是(指) yyy",
          "xxx 是(指)，yyy",
          "xxx 是指 yyy",
          "yyy，___称(之)为 xxx",
          "yyy(被)称(之)为 xxx"
        ],
        extract_title: ["Use AutoDef Configuration", "Confirm"]
      }
    },
    magicaction: {
      intro:
        "Please note that the following functions are used after selecting the card.\nClick for  specific usage and precautions",
      link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734", //Todo:修改英文版Notion
      option: {
        filter_cards: ["Filter Only Title", "Filter Entire Card"],
        merge_text: ["Merged as Excerpt", "Merged as Comment"],
        merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"],
        manage_profile: ["Read Configuration", "Write Configuration"]
      },
      help: {
        filter_cards:
          "Please see the help document for more precautions and specific input format",
        merge_text:
          "input delimiter. Please read the reference guide at the top for precautions and specific input formats.",
        rename_title:
          "Now it can be hierarchical numbered.Reference guide for precuations and specific input formats is at the top.",
        manage_profile:
          "It is forbidden to directly modify the configuration information, and the existing configuration will be overwritten after reading"
      },
      label: {
        filter_cards: "Filter Cards",
        merge_cards: "Merge Multiple Cards",
        merge_text: "Merge Text in Cards",
        rename_title: "Rename Titles",
        manage_profile: "Configuration Management"
      },
      hud: {
        is_clicked: "The card is selected, please continue",
        none_card: "No matching cards found",
        hierarchical_numbering:
          "Ensure that each selected card is at the same level and has child node"
      }
    },
    autostandardize: {
      intro: "Optimize the typography and formatting of excerpts & titles",
      link: "https://www.notion.so/huangkewei/AutoStandrize-ec4986eff67744d4b2a045a283267b99",
      option: {
        preset: [
          "Custom",
          "Delete All Spaces",
          "Half Width To Double Width",
          "Add Space Between Chinese&English", // Todo: 是否需要修改
          "Remove Multiple Spaces"
        ],
        standardize_selected: [
          "Optimize All",
          "Only Optimize Title",
          "Only Optimize Excerption"
        ]
      },
      help: {
        standardize_title: "Click for  specific specifications"
      },
      label: {
        standardize_selected: "Optimize Typography",
        standardize_title: " Normalize English Title",
        custom_standardize: "Customize. Click for specific formats",
        preset: "Select Presets"
      }
    },
    autoreplace: {
      intro: "Automatically replace errors in excerpts",
      link: "https://www.notion.so/huangkewei/AutoReplace-1cf1399ed90e4fc7a3e16843d37f2a56", //Todo:修改英文版Notion
      option: {
        preset: ["Custom"],
        replace_selected: ["Use AutoReplace Configuration", "Confirm"]
      },
      help: {
        replace_selected:
          "For the specific input format, see the reference guide at the top"
      },
      label: {
        preset: "Select Presets",
        replace_selected: "Replace Excerptions",
        custom_replace: "Customize. Click for specific formats"
      }
    },
    autolist: {
      intro:
        "For sequence text, automatic line wrapping, preset only for Chinese", //Todo: 需要修改
      link: "https://www.notion.so/huangkewei/AutoList-e56366855c4a4a6e9c80364d7cca0882", //Todo:修改英文版Notion
      option: {
        preset: [
          "Custom",
          "Multiple Choice",
          "Number at the beginning of the sentence",
          "Semicolon at the end of the sentence",
          "Period at the end of the Sentence"
        ], //Todo:需要修改
        list_selected: ["Use AutoList Configuration", "Confirm"]
      },
      help: {
        list_selected:
          "For the specific input format, see the reference guide at the top"
      },
      label: {
        preset: "Select Presets",
        custom_list: "Customize. Click for specific formats",
        list_selected: "Sequence Excerption Wrapping"
      }
    },
    autocomplete: {
      intro: "Complete word form. Only support verbs and nouns",
      link: "https://www.notion.so/huangkewei/AutoComplete-3b9b27baef8f414cb86c454a6128b608", //Todo:修改英文版Notion
      label: {
        fill_word_info: "Fill Word Info",
        custom_fill:
          "Custom excerption filling template, click for  support variables",
        complete_selected: "Complete Word Form"
      },
      option: {
        fill_word_info: ["None", "Custom", "Chinese"],
        complete_selected: [
          "Only complete word form",
          "Fill the word information as well"
        ]
      },
      error: {
        not_find_word: "No matching words found",
        forbid:
          "To reduce server pressure, it is forbidden to process more than 5 cards at the same time"
      }
    },
    anotherautotitle: {
      intro: "More powerful Autotitle",
      link: "https://www.notion.so/huangkewei/AnotherAutoTitle-bdd09b713c844a82aeea1c0d3bd4cb48", //Todo:修改英文版Notion
      option: {
        preset: ["Custom", "Word Count", "Do not Contain Dots"],
        switch_title: ["Switch to Another", "Swap Titles and Excerpts"]
      },
      label: {
        change_title_no_limit: "Title Always Be Title",
        preset: "Select Presets",
        custom_be_title: "Customize. Click for specific formats",
        switch_title: "Switch Excerption or Title",
        word_count:
          "[number of Chinese words, number of English words ], if not exceeded, then set the excerpt text as the title"
      },
      help: {
        switch_title: "Use [Swap Title and Excerpt] when both are present」",
        change_title_no_limit:
          "Broaden the title excerpt selection, always turn to the title"
      }
    },
    autotag: {
      intro: "Auto Add Tags",
      link: "https://www.notion.so/huangkewei/AutoTag-9e0bb2106d984ded8c29e781b53a1c23",
      option: {
        preset: ["Custom"],
        tag_selected: ["Use AutoTag Configuration", "Confirm"]
      },
      label: {
        preset: "Select Presets",
        custom_tag: "Customize. Click for specific formats",
        tag_selected: "Tag Cards"
      }
    },
    autostyle: {
      link: "https://www.notion.so/huangkewei/AutoStyle-16971d7c0fb048bd828d97373a035bc2",
      intro: "Auto modify excerpt colors and styles",
      area: "Aera",
      label: {
        preset: "Select Presets",
        change_style: "Modify Excerpt Style",
        change_color: "Modify Excerpt Color",
        show_area: "Show Excerpt Area",
        default_text_excerpt_color: "Default Text Excerpt Color",
        default_pic_excerpt_color: "Default Pic Excerpt Color",
        default_text_excerpt_style: "Default Text Excerpt Style",
        default_pic_excerpt_style: "Default Pic Excerpt Style",
        word_count_area:
          "[number of Chinese words, number of English words, area], if it exceeds, set the excerpt style to wireframe, otherwise the default.\n"
      },
      help: {
        change_color: "Enter the color index, 1 to 16"
      },
      option: {
        change_style: [
          "Use AutoStyle Configuration",
          "Wireframe+Fill",
          "Fill",
          "Wireframe"
        ],
        change_color: ["Use AutoStyle Configuration", "Confirm"],
        preset: [
          "Style is determined by word count or area",
          "color follow card",
          "Color follows frist child node",
          "Color follows parent node"
        ],
        style: ["None", "Wireframe+Fill", "Fill", "Wireframe"],
        color: [
          "None",
          "Light Yellow",
          "Light Green",
          "Light Blue",
          "light red",
          "Yellow",
          "Green",
          "Blue",
          "Red",
          "Orange",
          "Dark Green",
          "Dark Blue",
          "Dark Red",
          "White",
          "Light Grey",
          "Dark Grey",
          "Purple"
        ]
      }
    },
    more: {
      donate:
        "If you want to help me out, please click and go directly to the QR code.",
      mn5: "Since MarginNote5 will redesign the addon system, ohmymn will not be updated until MN5 is released."
    }
  },
  handle_received_event: {
    input_saved: "Input Saved",
    input_clear: "Input Clear",
    auto_correct:
      "Please select the switch according to the actual situation. It is not recommended to turn on automatic correction without brain.",
    lock_excerpt:
      "Locking excerpts is not recommended and auto-correction is turned on at the same time"
  },
  magic_action_handler: {
    not_selected: "None card is selected",
    smart_select: {
      title: "OhMyMN Smart Selector",
      option: [
        "Process only selected cards",
        "Process only child nodes",
        "Process only all descendant nodes",
        "Process selected and descendant nodes"
      ],
      card_with_children: "Detect only one selected card has child nodes",
      cards_with_children:
        "Detect all selected cards of the same level have child nodes"
    }
  },
  switch_panel: {
    better_with_mindmap: "OhMyMN is more compatible with mindmap"
  },
  handle_user_action: {
    sure: "Confirm",
    input_error: "Input errors, please re-enter",
    gesture: {
      alert:
        "When it is turned on, OhMyMN will monitor swipes on the mindmap nodes single and multiple selection toolbars and triggers the actions you set.\nThis feature is provided by OhMyMN and is not related to MarginNote. Have you read the doc and are aware of the specific gesture monitoring areas and the risks associated with their use?",
      option: ["Not sure, check the doc", "Sure, I know"],
      doc: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73"
    }
  },
  implement_datasource_method: {
    none: "None",
    open_panel: "Open the control panel"
  },
  addon_life_cycle: {
    remove: "OhMyMN deactivated, configuration reset"
  },
  profile_manage: {
    success: "Configuration read successfully",
    fail: "Configuration read fail",
    not_find: "Configuration information not found",
    prohibit: "[OhMyMN] configuration (no direct modification is allowed）"
  },
  other: {
    cancel: "Cancel"
  }
}

export default dict
