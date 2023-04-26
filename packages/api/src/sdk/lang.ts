import { MN } from "."

const zh = {
  copy_success: "复制成功, 快去粘贴吧!",
  copy_empty: "要复制的内容为空",
  sure: "确定",
  cancel: "🙅 取消",
  not_JSON: "返回值不是有效的 JSON 格式",
  not_receive: "没有收到返回值，请检查网络",
  make_your_choice: "做出你的选择"
}

const en: typeof zh = {
  copy_success: "Copy successfully, go ahead and paste",
  copy_empty: "The content to be copied is empty",
  sure: "Confirm",
  cancel: "🙅‍♀️ Cancel",
  not_JSON: "The returned value is not a valid JSON format",
  not_receive: "No return value received, please check the network",
  make_your_choice: "Make your choice"
}

export const lang = MN.isZH ? zh : en
