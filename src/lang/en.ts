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
      link: "https://huangkewei.notion.site/AnotherAutoDef-1852d4876891455681a90864ea35c828", //Todo:修改英文版Notion
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
      link: "https://www.notion.so/huangkewei/MagicAction-79afa352bad141f58075841614ded734", //Todo:修改英文版Notion
      option: {
        filter_cards: ["Detect Only Title", "Detect Entire Card"],
        change_fill_style: ["Frame+Color Fill", "Color Fill", "Frame"],
        merge_text: ["Merged as Excerpt", "Merged as Comment"],
        merge_cards: ["Merge Title Simultaneously", "Do not Merge Titles"]
      },
      help: {
        filter_cards: "Please see the help document for more precautions and specific input format",
        change_color: "input color index (1~16)",
        merge_text: "input delimiter. Please read the reference guide at the top for precautions and specific input formats.",
        rename_title: "Reference guide for precuations and specific input formats is at the top."
      },
      label: {
        filter_cards: "Filter Card",
        change_fill_style: "Change Fill Style",
        change_color: "Change Excerption Color",
        merge_cards: "Merge Multiple Cards",
        merge_text: "Merge Text in Cards",
        rename_title: "Bulk Rename Titles"
      },
      hud: {
        is_clicked: "The card is selected, please continue",
        none_card: "No matching cards found"
      }
    },
    autostandardize: {
      intro: "Optimize the typography and formatting of excerpts & titles\nPowerd by Pangu.js",
      option: {
        preset: [
          "Half angle to double angle",
          "Add Space",  // Todo: 是否需要修改
          "remove multiple spaces",
          "Title Normalization"  //Todo:我认为 Title Normalization 更好
        ],
        standardize_selected: ["Optimize All", "Only Optimize Title", "Only Optimize Excerption"]
      },
      label: {
        standardize_selected: "Optimize typography and formatting",
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
        not_find_word: "No matching words found"
      }
    },
    anotherautotitle: {
      intro: "More powerful Autotitle plugin",
      link: "https://www.notion.so/huangkewei/AnotherAutoTitle-bdd09b713c844a82aeea1c0d3bd4cb48", //Todo:修改英文版Notion
      option: {
        has_title_then: ["Convert to Excerption", "Convert to Title Link", "Override Title"],
        preset: ["Customize", "Word Count Limit", "Do not Contain Dots"],
        switch_title: ["Switch to Another", "Swap Titles and Excerpts"]
      },
      label: {
        has_title_then: "Title exists, continue excerpt",
        change_title_no_limit: "Broaden title excerption without limtation",
        preset: "Select Preset",
        custom_be_title: "Customize. click to view the specific format",
        switch_title: "Switch excerption or title",
        word_count: "Set the maximum number of characters"
      },
      help: {
        has_title_then: "Preconditions must also be met",
        switch_title: "Use [Swap Title and Excerpt] when both are present"
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
