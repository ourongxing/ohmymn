# 输入处理

OhMyMN 中有大量的输入框，需要进行字符串处理，这些字符串处理的方法都在 `utils/input.ts` 中，可以直接在 `~/utils` 中导入。

## reverseEscape
```ts
/**
 * Reverse escape a string
 * @param quote default false, if true, the str will be wrapped with double quotes
 */
function reverseEscape(str: string, quote = false) : string
```

反转义字符串，比如将 `\n` 转换为换行，将 `\\` 转换为 `\`，将 `\"` 转换为 `"`，将 `\'` 转换为 `'`。

这个函数的原理是利用来 JSON.parse 来进行反转义，所以如果字符串不是 JSON 格式的话，会抛出异常。所以需要用 `""` 包裹字符串，提供 quote 参数，如果 quote 为 true，则会在字符串两边加上 `"`。如果字符串中包含 `"`，则还需要先转换为 `\"`。

## escapeDoubleQuote
```ts
/**
 * Escape double quotes
 */
function escapeDoubleQuote(str: string): string
```
转义双引号，将 `"` 转换为 `\"`。结合 `reverseEscape` 使用。

## isIntegerString, isNumberString
```ts
const isIntegerString = (text: string) => /^[0-9]+$/.test(text)
const isNumberString = (text: string) => /^[0-9]+\.?[0-9]*$/.test(text)
```
判断字符串是否是整数或者数字。

## string2Reg
```ts
function string2Reg(str: string): RegExp
```
将字符串转为正则表达式对象。如果字符串不符合正则的格式，比如没有使用 // 包裹，则会当作普通字符串，会转义正则里的特殊字符。

```ts
string2Reg('a|b')

/a\|b/

string2Reg('/a|b/')

/a|b/
```

## string2RegArray
```ts
function string2RegArray(str: string): RegExp[][]
```
将字符串转为正则表达式对象。并且是二维数组。
比如
```ts
string2RegArray('/a|b/')

[[/a|b/]]

string2RegArray('[/a|b/g, /$hello^/]; [/a|b/]')

[[/a|b/g, /$hello^/], [/a|b/]]
```
具体支持的格式可以查看 [自定义格式](../../guide/custom.md#正则表达式)

## string2ReplaceParam
```ts
function string2ReplaceParam(str: string): ReplaceParam[]

interface ReplaceParam {
  regexp: RegExp
  newSubStr: string
  fnKey: number
}
```
将 replace 函数的自定义格式，转换为 ReplaceParam 数组。

举个例子
```ts
string2ReplaceParam('(/a|b/g, "new", 1)')

[{
  regexp: /a|b/g,
  newSubStr: "new",
  fnKey: 1
}]


string2ReplaceParam('(/a|b/g, "new", 1); (/a|b/g, "new", 1)')

[{
  regexp: /a|b/g,
  newSubStr: "new",
  fnKey: 1
},{
  regexp: /a|b/g,
  newSubStr: "new",
  fnKey: 1
}]
```

## extractArray
```ts
function extractArray(text: string, params: ReplaceParam[]): string[]
```

实现 [replace 函数格式](../../guide/custom.md#replace-函数) 的提取作用。

## regFlag
```ts
const regFlag: {
    add(reg: RegExp, flag: "g" | "i" | "m" | "s" | "y" | "u"): RegExp;
    remove(reg: RegExp, flag: "g" | "i" | "m" | "s" | "y" | "u"): RegExp;
}
```
添加或者删除正则表达式的 flag。