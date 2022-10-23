import { Addon } from "~/addon"
import { i18n } from "marginnote"

export default i18n({
  zh: {
    input_saved: "输入已保存",
    input_clear: "输入已清空",
    none: "无",
    sure: "确定",
    uninstall: {
      $options2: ["重置配置", "去论坛更新/反馈"] as StringTuple<2>,
      profile_reset: "配置已重置",
      have_bugs: "遇到 Bug 了吗？可以尝试重置配置或者更新到最新版本。"
    },
    read_failed: "自定义内容读取失败",
    detect_link: "检测到链接，是否直接打开？",
    no_doc: `当前笔记本没有文档，${Addon.title} 无法正常工作。如果你正要打算添加文档，请在添加完成后重新打开笔记本。`,
    not_select_card: "未选中任何脑图卡片",
    not_select_area: "没有选中任何区域",
    no_text_selection: "无法得到到选中区域的文字",
    text_more_option: {
      $options6: [
        "复制",
        "设置为标题",
        "合并标题",
        "合并到摘录",
        "设置为摘录",
        "设置为评论"
      ] as StringTuple<6>,
      selected_excerpt: "检测到您之前选中了一条摘录"
    },
    copy_success: "复制成功, 快去粘贴吧!",
    smart_select: {
      title: `${Addon.title} 智能选择`,
      $option4: [
        "仅处理选中的卡片",
        "仅处理子卡片",
        "仅处理所有后代卡片",
        "处理选中的卡片及其后代卡片"
      ],
      card_with_children: "检测到您选中的唯一卡片有子卡片",
      cards_with_children: "检测到您选中的多张同层级卡片均有子卡片"
    },
    handle_user_action: {
      gesture: {
        alert:
          "该功能由 OhMyMN 提供，与 MarginNote 无关。请问您是否详细阅读使用文档，并知晓具体手势监测区域和相关使用风险",
        option: ["不清楚，查看文档", "我已知晓"]
      }
    }
  },
  en: {
    input_saved: "Input Saved",
    input_clear: "Input Clear",
    detect_link: "Detect link, open it directly?",
    no_doc: `There is no document in the notebook, ${Addon.title} cannot work properly. If you are about to add documents, please reopen the notebook after adding.`,
    none: "None",
    sure: "Confirm",
    read_failed: "Custom content read failed",
    uninstall: {
      have_bugs:
        "have you met a bug? Try reset profile or update to newest version.",
      profile_reset: "Profile has been reset",
      $options2: ["Reset Profile", "Update/Feedback"]
    },
    not_select_card: "No card is selected",
    not_select_area: "No area is selected",
    no_text_selection: "Unable to get to the text of the selection",
    copy_success: "Copy successfully, go ahead and paste",
    text_more_option: {
      $options6: [
        "Copy",
        "Set as Title",
        "Merge Title",
        "Merge to Excerpt",
        "Set as Excerpt",
        "Set as Comment"
      ],
      selected_excerpt: "Detected that you previously selected an excerpt"
    },
    smart_select: {
      title: `${Addon.title} Smart Selector`,
      $option4: [
        "Process only selected cards",
        "Process only child cards",
        "Process only all descendant cards",
        "Process selected and descendant cards"
      ],
      card_with_children: "Detect only one selected card has child cards",
      cards_with_children:
        "Detect all selected cards of the same level have child cards"
    },
    handle_user_action: {
      gesture: {
        alert:
          "This feature is provided by OhMyMN and not related to MarginNote. Have you read the doc and are aware of the specific gesture monitoring areas and the risks associated with their use?",
        option: ["Not sure, check the doc", "Sure, I know"]
      }
    }
  }
})
