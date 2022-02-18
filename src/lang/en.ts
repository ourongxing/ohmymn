import { Dict } from "lang"

const dict: Dict = {
  module: {
    ohmymn: {
      link: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73",
      option: {
        profile: "Profile",
        has_title_then: ["Keep Intact", "As Title Link Style", "Override"],
        panel_position: ["Auto", "Left", "Center", "Right"],
        panel_height: ["Higher", "Standard", "Lower"],
        panle_control: [
          "Double Click Logo to Open",
          "Double Click Panel to Close",
          "Close Panel After Action"
        ]
      },
      label: {
        has_title_then: "If Title Exists",
        quick_switch: "Quick Switch",
        profile: "Choose Profile",
        panel_position: "Panel Position",
        panel_height: "Panel Height",
        panle_control: "Panel Open and Close",
        screen_always_on: "Keep Screen Always On",
        lock_excerpt: "Lock Excerpt Text",
        auto_correct: "Is Auto-Correct Enabled?"
      },
      help: {
        profile:
          "[Current Document Takes Effect]\nDifferent scenes, different profile",
        has_title_then:
          "Drag and drop the selection to merge into the card, and if a new title will be created by ohmymn, then",
        auto_correct:
          "[Current Document Takes Effect]\nBe sure to keep the same status as MN"
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
          "Customize extract title, click for  specific format",
        extract_title: "Extract Title From Card"
      },
      option: {
        title_link_split: ["Custom", "Default", "Punctuation"],
        preset: [
          "Custom Extract Title",
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
        "All actions need to select the card first \n Click for the specific use of all actions and notes",
      link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734", //Todo:修改英文版Notion
      option: {
        switch_title: ["Switch to Another", "Swap Titles and Excerpts"],
        filter_cards: ["Filter Only Title", "Filter Entire Card"],
        merge_text: ["Merged as Excerpt", "Merged as Comment"],
        merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"],
        manage_profile: ["Read Configuration", "Write Configuration"]
      },
      help: {
        from_which_module: module =>
          `This action comes from ${module} and uses the same profile`,
        switch_title: "Use [Swap Title and Excerpt] when both are present」",
        merge_text: "Input delimiter",
        rename_title: "Now it can be hierarchical numbered",
        manage_profile:
          "It is forbidden to directly modify the configuration information, and the existing configuration will be overwritten after reading"
      },
      label: {
        smart_selection: "Smart Selection",
        switch_title: "Switch Excerption or Title",
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
      label: {
        preset: "Select Presets",
        replace_selected: "Replace Excerptions",
        custom_replace: "Customize. Click for specific formats"
      }
    },
    autolist: {
      intro:
        "For text with serial number, auto add line breaks. All presets need to meet a minimum of two serial numbers",
      link: "https://www.notion.so/huangkewei/AutoList-e56366855c4a4a6e9c80364d7cca0882",
      option: {
        preset: ["Custom", "ABCD...", "一二三四...", "1234..."],
        list_selected: ["Use AutoList Configuration", "Confirm"]
      },
      label: {
        preset: "Select Presets",
        custom_list: "Customize. Click for specific formats",
        list_selected: "Add Line Breaks"
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
      intro:
        "What kind of excerpts should be automatically converted to titles?",
      link: "https://www.notion.so/huangkewei/AnotherAutoTitle-bdd09b713c844a82aeea1c0d3bd4cb48", //Todo:修改英文版Notion
      option: {
        preset: ["Custom", "Word Count", "Do not Contain Dots"]
      },
      label: {
        change_title_no_limit: "Title Always Be Title",
        preset: "Select Presets",
        custom_be_title: "Customize. Click for specific formats",
        word_count:
          "[number of words in a Chinese sentence, in a English sentence], if not exceeded, then set the excerpt text as the title"
      },
      help: {
        change_title_no_limit:
          "Change the title excerpt selection, always turn to the title"
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
          "[number of words in a Chinese sentence, in a English sentence, selected area size], if it exceeds, set the excerpt style to wireframe, otherwise the default.\n"
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
    copysearch: {
      intro: "Copy and search for what you want",
      link: "https://busiyi.notion.site/CopySearch-5977326e5d1640248e61ee855c4ef74b",
      lable: {
        multiple_titles: "If Multiple Titles",
        multiple_excerpts: "If Multiple Excerpts",
        custom_copy:
          "Customize what you search or copy, click to see which variables are supported",
        which_search_engine: "Choose Search Engine",
        search_card_info: "Search Card Content",
        copy_card_info: "Copy Card Content",
        show_search_engine: "Show Search URL"
      },
      option: {
        multiple_titles: ["All", "First", "Instant Choose"],
        multiple_excerpts: ["All", "First", "Instant Choose"],
        search_card_info: ["Title", "Excerpt Text", "Custom Content"],
        copy_card_info: ["Title", "Excerpt Text", "Custom Content"],
        which_search_engine: [
          "Instant Choose",
          "Chinese",
          "English",
          "Dict",
          "Translation",
          "Academic",
          "Question",
          "Other"
        ]
      },
      help: {
        show_search_engine: "Click to see how to customize the URL"
      },
      hud: {
        choose_you_want: (x: boolean) =>
          `Discover the card you selected has more than one${
            x ? "title" : "excerpt text"
          }. Choose one you want`,
        not_get_title: "No title found",
        not_get_excerpt: "No excerpt text found. What you see may be comments",
        choose_search_engine: "Which search engine to use this time",
        copy_seccess: "Copy successfully, go ahead and paste",
        one_card_search:
          "Default search the content of the first card, please do not select more than one card"
      }
    },
    more: {
      donate:
        "If you want to help me out, please click and go directly to the QR code.",
      mn5: "Since MarginNote5 will redesign the addon system, ohmymn will not be updated until MN5 is released.",
      auto: "Auto Executed When Excerpt"
    }
  },
  handle_received_event: {
    input_saved: "Input Saved",
    input_clear: "Input Clear",
    auto_correct:
      "Auto-correction and locked excerpt text do not work at the same time, please turn off either one. Otherwise, unexpected problems can occur!",
    lock_excerpt:
      "Locked excerpt text and auto-correction do not work at the same time, please turn off either one. Otherwise, unexpected problems can occur!"
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
  network: {
    null: "No return value received, please check the network",
    notJSON: "The return value is not in JSON format"
  },
  handle_gesture_event: {
    action_not_work: "is not enabled, the action cannot be executed"
  },
  other: {
    cancel: "Cancel"
  }
}

export default dict
