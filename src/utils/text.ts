const isHalfWidth = (text: string) =>
  text.match(/[\u0000-\u00ff]/g)?.length == text.length

const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"

const isCJK = (text: string) =>
  text.match(new RegExp(`^[${CJK}]*$`)) ? true : false

const countWord = (text: string): number => {
  const en = text
    .split(new RegExp(`[^a-zA-Z-']`, "g"))
    .filter(item => (item ? true : false))
  const zh = text.match(new RegExp(`[${CJK}]`, "g")) ?? []
  return en.length + zh.length
}

export { isHalfWidth, isCJK, countWord, CJK }
