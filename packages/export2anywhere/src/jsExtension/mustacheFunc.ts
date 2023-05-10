import { removeHighlight } from "marginnote"
import { dateFormat, getSerialInfo } from "~/utils"

export const oldFunc: {
  [key: string]: () => (text: string, render: (p: string) => string) => string
} = {
  escape: () => (text, render) => encodeURIComponent(render(text)),
  nohl: () => (text, render) => removeHighlight(render(text)),
  blod: () => (text, render) =>
    render(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"),
  clozeSync: () => (text, render) =>
    render(text).replace(/\*\*(.+?)\*\*/g, "{{c1::$1}}"),
  cloze: () => (text, render) => {
    let index = 1
    return render(text).replace(/\*\*(.+?)\*\*/g, (_, m) => {
      return `{{c${index++}::${m}}}`
    })
  },
  lower: () => (text, render) => render(text).toLowerCase(),
  upper: () => (text, render) => render(text).toUpperCase(),
  join: () => (text, render) => {
    if (text.match(/{{.+}}/g)?.length !== 1) return render(text)
    const [front, mustache, behind] = text.trimStart().split(/({{.+?}})/, 3)
    const dataArr = render(mustache).split(/; /)
    if (/\$\[.+\]/.test(front)) {
      const serialArr = getSerialInfo(front, dataArr.length, "\\$")
      return dataArr
        .map((k, i) => front.replace(/\$\[(.+)\]/, serialArr[i]) + k)
        .join(behind)
    }
    return dataArr.map(k => front + k).join(behind)
  }
}

export const func: {
  [key: string]: (value: string, ...rest: string[]) => string
} = {
  upper: value => {
    return value.toUpperCase()
  },
  lower: value => {
    return value.toLowerCase()
  },
  escape: value => {
    return encodeURIComponent(value)
  },
  nohl: value => {
    return value.replace(/\*\*(.+?)\*\*/g, "$1")
  },
  blod: value => {
    return value.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
  },
  clozeSync: value => {
    return value.replace(/\*\*(.+?)\*\*/g, " {{c1::$1}} ")
  },
  cloze: value => {
    let index = 1
    return value.replace(/\*\*(.+?)\*\*/g, (_, m) => {
      return ` {{c${index++}::${m}}} `
    })
  },
  join: (value, prefix, suffix) => {
    let item = value.split("; ")
    if (!Array.isArray(item) || item.length < 2) return value
    if (/\$\[.+\]/.test(prefix ?? "")) {
      const serialArr = getSerialInfo(prefix, item.length, "\\$")
      item = item.map((k, i) => prefix.replace(/\$\[(.+)\]/, serialArr[i]) + k)
    } else if (prefix) item = item.map(k => (k = prefix + k))
    return item.join(suffix ?? "; ")
  },
  fmt: (value, format) => {
    const date = new Date(value)
    if (date instanceof Date) return dateFormat(date, format)
    return value
  }
}
