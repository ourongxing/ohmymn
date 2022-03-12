import { Dict } from "lang"
const dict: Dict = {
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
  magicaction_from_which_module: (module: string) =>
    `This action comes from ${module} and uses the same profile`,
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
    open_panel: "Open The Control Panel"
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
  more: {
    donate:
      "If you want to help me out, please click and go directly to the QR code.",
    mn5: "Since MarginNote5 will redesign the addon system, ohmymn will not be updated until MN5 is released."
  },
  cancel: "Cancel"
}

export default dict
