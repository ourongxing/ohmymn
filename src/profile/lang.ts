import { Addon } from "~/addon"
import { MN } from "~/sdk"

const zh = {
  note_title: `${Addon.title} 配置`,
  note_content: (range: string, time: string, module?: string) =>
    `🚫 请勿修改\n范围：${range}\n${
      module ? "模块：" + module + "\n" : ""
    }版本：${Addon.version}\n时间：${time}`,
  one_module_global: (n: number, module: string) =>
    `检测到全局配置 ${n}，只包括模块 ${module}，写入到哪一套全局配置中？`,
  profile_management: `${Addon.title} 配置管理`,
  detecte_doc_profile: "检测到文档配置，读取后会覆盖当前配置，是否继续？",
  detecte_notebook_profile:
    "检测到笔记本配置，读取后会覆盖当前配置，是否继续？",
  detecte_all_profile: "检测到所有配置，可以选择需要的部分导入",
  detecte_all_notebook_profile: "检测到所有全局配置，可以选择需要的部分导入",
  detecte_global_profile: (n?: number) =>
    n
      ? `检测到全局配置 ${n}，包含所有模块，可以选择需要的模块配置导入`
      : `可以选择需要的模块配置导入`,
  which_part_profile: "想要写入哪部分的配置?",
  which_module_profile_write: "想要写入哪个模块的配置?",
  which_global_profile_read_into: "想要读取进哪一套全局配置里?",
  parse_failed: "解析失败，可能被修改",
  all_modules: "所有模块",
  no_children: "该卡片没有子卡片",
  success: "读取成功",
  fail: "读取失败",
  profile_reset: "配置已重置",
  old_version: "旧版本配置，请退回到 v4.0.0 - v4.0.4 再导入",
  not_this_profile: `不是 ${Addon.title} 的配置`,
  range: {
    all_profile: "所有配置",
    global_profile: "全局配置",
    all_global_profile: "所有全局配置",
    doc_profile: "文档配置",
    notebook_profile: "笔记本配置"
  },
  $profile_select_items: [
    "所有配置",
    "全局配置 1",
    "全局配置 2",
    "全局配置 3",
    "全局配置 4",
    "全局配置 5",
    "所有全局配置",
    "文档配置",
    "笔记本配置"
  ],
  $global_profile_items: [
    "全局配置 1",
    "全局配置 2",
    "全局配置 3",
    "全局配置 4",
    "全局配置 5"
  ]
}

const en: typeof zh = {
  note_title: `${Addon.title} Profile`,
  note_content: (range: string, time: string) =>
    `🚫 Do Not Modify\nRange: ${range}\n${
      module ? "Module: " + module + "\n" : ""
    }Version: ${Addon.version}\nTime: ${time}`,
  one_module_global: (n: number, module: string) =>
    `Global profile ${n} was detected, including module ${module} only, and which global profile was written to?`,
  profile_management: `${Addon.title} Profile Management`,
  which_part_profile: "Which part of the profile do you want to write?",
  which_global_profile_read_into:
    "Which global profile do you want to read into?",
  which_module_profile_write: "Which module do you want to write?",
  parse_failed: "Parse failed, maybe modified",
  detecte_doc_profile:
    "Detected document profile, reading will overwrite the current profile, continue?",
  detecte_notebook_profile:
    "Detected notebook profile, reading will overwrite the current profile, continue?",
  detecte_all_profile:
    "Detected all profile, you can choose one part you need to import",
  detecte_all_notebook_profile:
    "Detected all notebook profile, you can choose one part you need to import",
  all_modules: "All Modules",
  success: "Read successfully",
  profile_reset: "Profile has been reset",
  fail: "Read failed",
  old_version:
    "Old version profile, please return to v4.0.0 - v4.0.4 and import again",
  not_this_profile: `Not ${Addon.title}'s profile`,
  detecte_global_profile: (n?: number) =>
    n
      ? `Detected global profile ${n}, including all modules, you can choose one module you need to import`
      : `You can choose one module you need to import`,
  range: {
    all_profile: "All Profile",
    global_profile: "Global Profile",
    all_global_profile: "All Global Profile",
    doc_profile: "Doc Profile",
    notebook_profile: "Notebook Profile"
  },
  $profile_select_items: [
    "All Profile",
    "Global Profile 1",
    "Global Profile 2",
    "Global Profile 3",
    "Global Profile 4",
    "Global Profile 5",
    "All Global Profile",
    "Doc Profile",
    "Notebook Profile"
  ],
  $global_profile_items: [
    "Global Profile 1",
    "Global Profile 2",
    "Global Profile 3",
    "Global Profile 4",
    "Global Profile 5"
  ],
  no_children: "This card has no child card."
}

export const lang = MN.isZH ? zh : en
