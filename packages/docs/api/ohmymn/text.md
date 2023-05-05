# 文字相关
可以从 `~/utils` 中导入。

## CJKRegex, isCJK, notCJK
```ts
const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
const CJKRegex = new RegExp(`([${CJK}])`, "g")

const isCJK = (text: string) => CJKRegex.test(text)
const notCJK = (text: string) => !isCJK(text)
```
CJK 也就是中日韩统一表意文字，这个正则表达式会匹配所有的 CJK 字符。

## isHalfWidth
```ts
const isHalfWidth = (text: string) => /^[\u0000-\u00ff]*$/.test(text)
```
判断字符串是否全都是半角字符，通常用于判断是否是英文。

## isLanguage
```ts
const isLanguage = {
  // Russian
  Cyrillic: (text: string) => /\p{sc=Cyrillic}/u.test(text),
  // English, French, German...
  Latin: (text: string) => /\p{sc=Latin}/u.test(text),
  // Chinese, Janpanese, Korean。由于日语和韩语均有可能出现汉字，导致不能准确判断。
  CJK: (text: string) => CJKRegex.test(text),
  Han: (text: string) => /\p{sc=Han}/u.test(text),
  // not full
  Janpanese: (text: string) =>
    /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff]/u.test(text),
  Korea: (text: string) => /\p{sc=Hangul}/u.test(text)
}
```

使用 Unicode 的属性来判断字符串是否是某种语言。

## countWord
```ts
function countWord(text: string): number
```
统计字符串的单词数，中文会被当作一个单词。

## byteLength
```ts
function byteLength(text: string): number
```
统计字符串的字节数，中文会被当作两个字节。
