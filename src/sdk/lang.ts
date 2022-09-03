import { MN } from "~/addon"

const zh = {
  copy_success: "复制成功, 快去粘贴吧!",
  sure: "确定",
  cancel: "取消",
  notJSON: "返回值不是有效的 JSON 格式",
  notReceive: "没有收到返回值，请检查网络"
}
const en: typeof zh = {
  copy_success: "Copy successfully, go ahead and paste",
  sure: "Confirm",
  cancel: "Cancel",
  notJSON: "The returned value is not a valid JSON format",
  notReceive: "No return value received, please check the network"
}

export const lang = MN.isZH ? zh : en
