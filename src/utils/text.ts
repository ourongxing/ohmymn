const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"

const isHalfWidth = (text: string) => /^[\u0000-\u00ff]*$/.test(text)
const isCJK = (text: string) => new RegExp(`[${CJK}]`).test(text)
const notCJK = (text: string) => !isCJK(text)

const isLanguage = {
  // Russian
  Cyrillic: (text: string) => /\p{sc=Cyrillic}/u.test(text),
  // English, French, German...
  Latin: (text: string) => /\p{sc=Latin}/u.test(text),
  // Chinese, Janpanese, Korean。由于日语和韩语均有可能出现汉字，导致不能准确判断。
  CJK: (text: string) => new RegExp(`[${CJK}]`).test(text),
  Han: (text: string) => /\p{sc=Han}/u.test(text),
  // not full
  Janpanese: (text: string) =>
    /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff]/u.test(text),
  Korea: (text: string) => /\p{sc=Hangul}/u.test(text)
}

function countWord(text: string): number {
  const en = text
    .split(new RegExp(`[^\\p{L}0-9\\-'.]|[${CJK}]`, "u"))
    .reduce((acc, cur) => {
      if (cur) {
        if (/\D\.\D/.test(cur)) acc.push(...cur.split("."))
        else acc.push(cur)
      }
      return acc
    }, [] as string[])
  const zh = text.match(new RegExp(`[${CJK}]`, "g")) ?? []
  return en.length + zh.length
}

function byteLength(text: string) {
  return Array.from(text).reduce((acc, cur) => {
    acc += cur.charCodeAt(0) > 255 ? 2 : 1
    return acc
  }, 0)
}

function byteSlice(text: string, begin: number, ...rest: number[]) {
  const res = [begin, ...rest].map(k => {
    if (k < 0) k = byteLength(text) + k
    if (k === 0 || k === 1) return k
    return (
      Array.from(text).reduce(
        (acc, cur, index) => {
          const byte = acc.byte + (cur.charCodeAt(0) > 255 ? 2 : 1)
          if (!acc.enough && byte <= k) {
            acc = { index, byte, enough: false }
          } else {
            acc = {
              ...acc,
              enough: true
            }
          }
          return acc
        },
        {
          index: 0,
          byte: 0,
          enough: false
        }
      ).index + 1
    )
  })
  return text.slice(...res)
}

function byteSplitByLen(text: string, len: number) {
  const { str, segments } = Array.from(text).reduce(
    (acc, cur) => {
      const byte = acc.byte + (cur.charCodeAt(0) > 255 ? 2 : 1)
      if (byte > len)
        return {
          str: cur,
          segments: [...acc.segments, acc.str],
          byte: cur.charCodeAt(0) > 255 ? 2 : 1
        }
      const str = acc.str + cur
      if (byte === len)
        return {
          str: "",
          segments: [...acc.segments, str],
          byte: 0
        }
      return {
        str,
        segments: acc.segments,
        byte
      }
    },
    {
      str: "",
      segments: [] as string[],
      byte: 0
    }
  )
  return str === "" ? segments : [...segments, str]
}

export {
  isHalfWidth,
  isCJK,
  countWord,
  CJK,
  notCJK,
  byteLength,
  byteSlice,
  byteSplitByLen,
  isLanguage
}
