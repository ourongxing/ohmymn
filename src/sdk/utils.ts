function byteLength(text: string) {
  return Array.from(text).reduce((acc, cur) => {
    acc += cur.charCodeAt(0) > 255 ? 2 : 1
    return acc
  }, 0)
}

export function byteSlice(text: string, begin: number, ...rest: number[]) {
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

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))

export function escapeURLParam(param: string) {
  const replaceParams = [
    [/%/g, "%25"],
    [/#/g, "%23"],
    [/&/g, "%26"],
    [/;/g, "%3B"],
    [/\+/g, "%2B"],
    [/\//g, "%2F"],
    [/\\/g, "%5C"],
    [/=/g, "%3D"],
    [/\?/g, "%3F"],
    [/\./g, "%2E"],
    [/\:/g, "%3A"]
  ] as [RegExp, string][]
  return replaceParams.reduce((acc, cur) => acc.replace(cur[0], cur[1]), param)
}
