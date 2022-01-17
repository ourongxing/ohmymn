import { Dict } from "lang"

const dict = {
  addon: {
    ohmymn: {
      link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
      option: {
        profile: "Profile",
 		has_title_then: ["As Comments", "As Title Link", "Override"],
        panel_position: ["Auto", "Left", "Center", "Right"],
        panel_height: ["Higher", "Standard", "Lower"],
		panle_control: [
          "Double Click Logo Open Panel",
          "Double Click Panel to Close",
          "Close Panel after Action"
        ],
        detect_update: [
          "Never",
          "Everyday",
          "Every Monday",
          "Everyday for Signed Vers.",
          "Every Monday for Signed Vers."
        ]
      },
      label: {
        has_title_then: "Title exists, Continue excerpt",
		    quick_switch: "Quick Switch",
        profile: "Choose Profile",
		    detect_update: "Auto Detect Update",
        panel_position: "Panel Position",
        panel_height: "Panel Height",
        panle_control: "Panel on and off",
        screen_always_on: "Keep Screen Always On",
        lock_excerpt: "Lock Excerpt Text",
        auto_correct: "Auto Correct Excerpt Text Online"
      },
      help: {
        profile: "[Current Document Takes Effect] Can be used in different scenarios",
 		has_title_then: "If can be turned into a title, then",
		complete_close: "Automatically close the control panel after the MagicAction is executed",
        auto_correct: "[Current Document Takes Effect] After opening, it will be processed after auto-correction"
      },
	  detect_update: {
        tip: (time: string, version: string, signed: boolean) =>
          `${time} update，version：${version}\n whether signed：${signed ? "Yes" : "No"}`,
        check_update: "Check for updates"
      }
    },
    gesture: {
      intro: "Custom Gestures to Trigger Actions",
	  link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
      singleBar: "Single Selection Toolbar",
      muiltBar: "Multi Selection Toolbar"
    },
    anotherautodef: {
      intro:
        "Extract the defined terms and any other content as title or title link\n Definition = Defined Term + Connective of Definition + Definiens", //Question:有待商议
      link: "https://huangkewei.notion.site/AnotherAutoDef-1852d4876891455681a90864ea35c828", //Todo:修改英文版Notion
      label: {
        only_desc: "Excerpts only keep definiens",
        to_title_link: "Convert alias to title link",
        custom_split: "Customize alias participle, click to view specific format",
        preset: "Choose the desired preset",
        custom_def_link: "Customize connective of definition, click to view the specific format",
        custom_extract_title: "Customize extract content, click to view specific format",
        extract_title: "Extract title from card"
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
        ],
		extract_title: ["Use configuration from AutoDef", "Confirm"]
      }
    },
    magicaction: {
      intro:
        "Please note that the following functions are used after selecting the card.\n Click to view specific usage and precautions", 
      link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734", //Todo:修改英文版Notion
      option: {
        filter_cards: ["Detect Only Title", "Detect Entire Card"],
        merge_text: ["Merged as Excerpt", "Merged as Comment"],
        merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"],
		manage_profile: ["Read Configuration Information", "Write Configuration Information"]
      },
      help: {
        filter_cards: "Please see the help document for more precautions and specific input format",
        merge_text: "input delimiter. Please read the reference guide at the top for precautions and specific input formats.",
        rename_title: "Reference guide for precuations and specific input formats is at the top.",
		manage_profile: "It is forbidden to directly modify the configuration information, and the existing configuration will be overwritten after reading"
      },
      label: {
        filter_cards: "Filter Card",
        merge_cards: "Merge Multiple Cards",
        merge_text: "Merge Text in Cards",
        rename_title: "Bulk Rename Titles",
		manage_profile: "Configuration Management"
      },
      hud: {
        is_clicked: "The card is selected, please continue",
        none_card: "No matching cards found"
      }
    },
    autostandardize: {
      intro: "Optimize the typography and formatting of excerpts & titles\nPowerd by Pangu.js",
 	  link: "https://busiyi.notion.site/AutoStandrize-b5e0d381d4814139a1b73d305ebc12d1",
      option: {
        preset: [
		  "Customized",
		  "Delete All Spaces",
          "Half angle to double angle",
          "Add Space",  // Todo: 是否需要修改
          "remove multiple spaces",
          "Title Normalization"  //Todo:我认为 Title Normalization 更好
        ],
        standardize_selected: ["Optimize All", "Only Optimize Title", "Only Optimize Excerption"]
      },
	  help: {
        standardize_title: "Click to view specific specifications"
      },
      label: {
        standardize_selected: "Optimize typography and formatting",
		standardize_title: "English title normalization",
        custom_standardize: "Customize, click to view the specific format",
        preset: "Select the desired preset"
      }
    },
    autoreplace: {
      intro: "Automatically replace errors in excerpts",
      link: "https://www.notion.so/huangkewei/AutoReplace-1cf1399ed90e4fc7a3e16843d37f2a56", //Todo:修改英文版Notion
      option: {
        preset: ["Customize"],
        replace_selected: ["Use AutoReplace Configuration", "Confirm"]
      },
      help: {
        replace_selected: "For the specific input format, see the reference guide at the top"
      },
      label: {
        preset: "Select Presets",
        replace_selected: "Bulk Replace Excerptions",
        custom_replace: "Customize. click to view the specific format"
      }
    },
    autolist: {
      intro: "For sequence text, automatic line wrapping", //Todo: 需要修改
      link: "https://www.notion.so/huangkewei/AutoList-e56366855c4a4a6e9c80364d7cca0882", //Todo:修改英文版Notion
      option: {
        preset: ["Customize", "Multiple Choice", "Number at the beginning of the sentence", "Semicolon at the end of the sentence", "Period at the end of the Sentence"], //Todo:需要修改
        list_selected: ["Use AutoList Configuration", "Confirm"]
      },
      help: {
        list_selected: "For the specific input format, see the reference guide at the top"
      },
      label: {
        preset: "Select Presets",
        custom_list: "Customize. click to view the specific format",
        list_selected: "Sequence Excerption Wrapping"
      }
    },
    autocomplete: {
      intro: "Complete word form. Only support verbs and nouns",
      link: "https://www.notion.so/huangkewei/AutoComplete-3b9b27baef8f414cb86c454a6128b608", //Todo:修改英文版Notion
      label: {
        custom_complete: "Custom excerption filling template, click to view support variables",
        complete_selected: "Complete Word Form"
      },
      option: {
        complete_selected: ["Only complete word form", "Fill the word information as well"]
      },
      error: {
        not_find_word: "No matching words found",
		forbid: "To reduce server pressure, it is forbidden to process more than 5 cards at the same time"
      }
    },
    anotherautotitle: {
      intro: "More powerful Autotitle plugin",
      link: "https://www.notion.so/huangkewei/AnotherAutoTitle-bdd09b713c844a82aeea1c0d3bd4cb48", //Todo:修改英文版Notion
      option: {
        preset: ["Customize", "Word Count Limit", "Do not Contain Dots"],
        switch_title: ["Switch to Another", "Swap Titles and Excerpts"]
      },
      label: {
        change_title_no_limit: "Broaden title excerption without limtation",
        preset: "Select Preset",
        custom_be_title: "Customize. click to view the specific format",
        switch_title: "Switch excerption or title",
        word_count: "Set the maximum number of characters"
      },
      help: {
        switch_title: "Use [Swap Title and Excerpt] when both are present」"
      }
    },
	autotag: {
      intro: "Auto Add Tags",
      link: "https://busiyi.notion.site/AutoTag-3a7fc5e0b84e47d18366d4cb60c4943d",
      option: {
        preset: ["Customized"],
        tag_selected: ["Use configuration for AutoTag", "Confirm"]
      },
	  label: {
        preset: "Select the desired preset",
        custom_tag: "Customize, click to view the specific format",
        tag_selected: "Tag a card"
      }
	},
	autostyle: {
      link: "https://busiyi.notion.site/AutoStyle-008cc0fae7844e7fb171ca948da91cb5",
      intro: "Automatically modify excerpt colors and styles",
      area: "Aera",
      label: {
        preset: "Select Desired Preset",
        change_style: "Modify Excerpt Style",
        change_color: "Modify Excerpt Color",
        show_area: "Show Excerpt Area",
        default_text_excerpt_color: "Default Text Excerpt Color",
        default_pic_excerpt_color: "Default Pic Excerpt Color",
        default_text_excerpt_style: "Default Text Excerpt Style",
        default_pic_excerpt_style: "Default Pic Excerpt Style",
        word_count_area:
          "[Number of Chinese words, number of English words, area], if it exceeds, set the excerpt style to wireframe, otherwise the default"
      },
      help: {
        change_color: "Enter the color index, 1 to 16"
      },
      option: {
        change_style: ["Use AutoStyle Configuration", "Frame+Fill", "Fill", "Frame"],
        change_color: ["Use AutoStyle Configuration", "confirm"],
        preset: [
          "Style is determined by word count or area",
          "color follow card",
          "Color follows child nodes",
          "Color follows parent node"
        ],
        style: ["None", "Frame+Fill", "Fill", "Frame"],
        color: [
          "none",
          "light yellow",
          "light green",
          "light blue",
          "light red",
          "yellow",
          "green",
          "blue",
          "red",
          "orange",
          "dark green",
          "dark blue",
          "dark red",
          "white",
          "light grey",
          "dark grey",
          "purple"
        ]
      }
    },
    more: {
      donate: "If you want to help me out, please click and go directly to the QR code.",
      github:
        "ohmymn is completely open source, easy to extend, welcome to participate in development. Click to go directly to Github and view the source code.",
      feishu:
        "Click to join the Feishu Group to exchange ohmymn usage skills. I will solve your questions from time to time."
    }
  },
  handle_received_event: {
    input_saved: "Input Saved",
    input_clear: "Input Clear",
    auto_correct: "Please select the switch according to the actual situation. It is not recommended to turn on automatic correction without brain.",
    lock_excerpt: "Locking excerpts is not recommended and auto-correction is turned on at the same time"
  },
  magic_action_handler: {
    not_selected: "None card is selected",
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
    clicked: "Clicked",
    bind_key: "bind key input error",
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
