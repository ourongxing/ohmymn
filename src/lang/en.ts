import { Addon } from "~/addon"
import { Dict } from "."

const dict: Dict = {
  input_saved: "Input Saved",
  input_clear: "Input Clear",
  none: "None",
  sure: "Confirm",
  uninstall: {
    have_bugs:
      "have you met a bug? Try reset profile or update to newest version.",
    profile_reset: "Profile has been reset",
    $options: ["Reset Profile", "Update/Feedback"]
  },
  input_number: "Please enter a number",
  input_integer: "Please enter an integer",
  input_positive: "Please enter a positive integer",
  no_profile_in_card: "No profile exists in the card",
  open_panel: "Switch Control Panel",
  input_error: "Input errors, please re-enter",
  not_select_card: "No card is selected",
  not_select_text: "No text is selected",
  action_not_work: "Module is not enabled, the action cannot be executed",
  no_text_selection: "Unable to get to the text of the selection",
  copy_success: "Copy successfully, go ahead and paste",
  smart_select: {
    title: `${Addon.title} Smart Selector`,
    $option: [
      "Process only selected cards",
      "Process only child cards",
      "Process only all descendant cards",
      "Process selected and descendant cards"
    ],
    card_with_children: "Detect only one selected card has child cards",
    cards_with_children:
      "Detect all selected cards of the same level have child cards"
  },
  magicaction_from_which_module: (module: string) =>
    `This action comes from ${module} and uses the same settings`,
  handle_user_action: {
    gesture: {
      alert:
        "This feature is provided by OhMyMN and not related to MarginNote. Have you read the doc and are aware of the specific gesture monitoring areas and the risks associated with their use?",
      option: ["Not sure, check the doc", "Sure, I know"],
      doc: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73"
    }
  }
}

export default dict
