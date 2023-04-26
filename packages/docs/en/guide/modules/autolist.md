# AutoList

When excerpting lists, multiple choice questions, etc., it is often necessary to make separate line breaks, which is not possible with OCR.

## Preset

Three presets are provided. Each preset includes customizations that must match two serial numbers before they are executed.

`(/\s*([A-Za-z][.、，,])/g, "\n$1")`

- Letter ABCD, including abcd
  - Valid when the letter is followed by `.、，,` and **only in Chinese**

`(/\s*([其第]?[一二三四五六七八九十]{1,2}[.、，,])|\s*([其第][一二三四五六七八九十]{1,2}是?[.、，,]?)/g, "\n$1$2")`

- "一二三四". Such a complex regexl is to avoid interfering with the normal excerpting as much as possible.
  - Valid when "一二三四" is precede by `其｜第`.
  - Valid when "一二三四" is followed by `.、，,`.

`/\s*([\(（【\[]?\s*[0-9]{1,2}\s*[\)）\]】]?[.、，,]\D)|\s*([\(（【\[]\s*[0-9]{1,2}\s*[\)）\]】][.、，,]?)/g`

- 1234
  - (1) （1） [1] 【1】are valid.
  - 1 `.、，,` are valid.

## Custom

::: warning Input Format
[Replace() Method Format —— Replace](../custom.md#replace-method)
:::

Add `\n` before or after the matched string, which is the EOL character.

To add a number to each line, the third parameter of the replace function, `fnKey`, is used here. The numbering is distinguished by setting a different number for it.

| fnKey | Numbered List Type |
|-------|--------------------|
| `1`   | 1. 2. 3.           |
| `2`   | A. B. C.           |
| `3`   | a. b. c.           |
| `4`   | 壹、贰、叁           |
| `5`   | 一、二、三           |
| `6`   | ① ② ③              |
| `7`   | ❶ ❷ ❸              |

**Example**

- `(/[;；]/, "$&\n", 1)`
  - Denotes line break after  `;` or `；`, and number each line with  1. 2. 3.

## [MarginNote for Card](magicaction4card.md#add-line-break)

## Add Line Break

Same as customization.