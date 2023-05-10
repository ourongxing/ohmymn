import { i18n } from "marginnote"

export default i18n({
  zh: {
    no_profile_in_card: "自定义内容读取失败",
    input_number: "请输入数字",
    input_integer: "请输入整数",
    parse_error: "字符串解析错误，请注意字符转义问题",
    input_positive: "请输入正整数",
    not_support_symbol: "不支持该符号",
    no_item: "数组内必须有元素，并且第一个元素必须是字符",
    require_number: "必须输入数字和单个字符",
    ban_1: `禁止使用 "//"`,
    ban_2: `禁止使用 "/./" ，请使用 "/^.+$/gs" 来进行任意非空匹配`,
    not_support_format: "不符合输入格式要求",
    not_mnlink: "不是 MN 的卡片链接",
    not_exist: "卡片不存在"
  },
  en: {
    no_profile_in_card: "Failed to read custom content",
    input_number: "Please enter a number",
    parse_error: "String parsing error, please note character escape problems",
    input_integer: "Please enter an integer",
    input_positive: "Please enter a positive integer",
    not_support_symbol: "Symbol not supported",
    ban_1: `Do not use "//"`,
    ban_2: `Do not use "/./" , please use "/^.+$/gs" to match any non-empty`,
    no_item:
      "There must be elements in the array, and the first element must be a character",
    require_number: "You must enter a number and a single character",
    not_support_format: "Does not meet the input format requirements",
    not_mnlink: "Not a MN card link",
    not_exist: "Card does not exist"
  }
})
