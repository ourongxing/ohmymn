const isHalfWidth = (text: string) =>
  text.match(/[\u0000-\u00ff]/g)?.length == text.length

const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"

// 序号 https://www.qqxiuzi.cn/wz/zixun/1704.htm
const SerialCode = {
  hollow_circle_number:
    "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿",
  solid_circle_number: "❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴",
  capital_letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase_letter: "abcdefghijklmnopqrstuvwxyz",
  chinese_capital_number: "壹贰叁肆伍陆柒捌玖拾",
  chinese_number: "一二三四五六七八九十",
  greek_capital_number: "ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ",
  greek_number: "ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ"
}

const isCJK = (text: string) =>
  text.match(new RegExp(`^[${CJK}]*$`)) ? true : false

const countWord = (text: string): number => {
  const en = text.split(/[^a-zA-Z]/).filter(k => k)
  const zh = text.match(new RegExp(`[${CJK}]`, "g")) ?? []
  return en.length + zh.length
}

const byteLength = (text: string) => {
  let length = 0
  Array.from(text).forEach(char => {
    length += char.charCodeAt(0) > 255 ? 2 : 1
  })
  return length
}

export { isHalfWidth, isCJK, countWord, CJK, byteLength, SerialCode }
