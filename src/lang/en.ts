import { Addon } from "const"
import { Dict } from "lang"
const dict: Dict = {
  input_saved: "Input Saved",
  input_clear: "Input Clear",
  sure: "Confirm",
  none: "None",
  cancel: "Cancel",
  input_number: "Please enter a number",
  input_integer: "Please enter an integer",
  input_positive: "Please enter a positive integer",
  no_profile_in_card: "No profile exists in the card",
  make_sure_autoocr:
    "Make sure AutoOCR is enabled and the Key is entered, otherwise it won't work!",
  open_panel: "Open The Control Panel",
  input_error: "Input errors, please re-enter",
  disconnect_addon: `${Addon.title} deactivated, configuration reset`,
  not_select_card: "No card is selected",
  not_select_text: "No text is selected",
  no_text_selection: "Unable to get to the text of the selection",
  smart_select: {
    title: `${Addon.title} Smart Selector`,
    option: [
      "Process only selected cards",
      "Process only child nodes",
      "Process only all descendant nodes",
      "Process selected and descendant nodes"
    ],
    card_with_children: "Detect only one selected card has child nodes",
    cards_with_children:
      "Detect all selected cards of the same level have child nodes"
  },
  magicaction_from_which_module: (module: string) =>
    `This action comes from ${module} and uses the same profile`,
  handle_user_action: {
    gesture: {
      alert:
        "When it is turned on, OhMyMN will monitor swipes on the mindmap nodes single and multiple selection toolbars and triggers the actions you set.\nThis feature is provided by OhMyMN and is not related to MarginNote. Have you read the doc and are aware of the specific gesture monitoring areas and the risks associated with their use?",
      option: ["Not sure, check the doc", "Sure, I know"],
      doc: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73"
    }
  },
  profile_manage: {
    success: "Configuration read successfully",
    fail: "Configuration read fail",
    not_find: "Configuration information not found",
    prohibit:
      "「${Addon.title}」configuration (no direct modification is allowed）"
  },
  action_not_work: "is not enabled, the action cannot be executed"
}

export default dict
