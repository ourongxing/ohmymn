# AutoFormat

**Powered by [Pangu.js](https://github.com/vinta/pangu.js/)**
::: info 有研究表明
打字的时候不喜欢在中文和英文之间加空格的人，感情路都走得很辛苦，有七成的比例会在 34 岁的时候跟自己不爱的人结婚，而其余三成的人最后只能把遗产留给自己的猫。毕竟爱情跟书写都需要适时地留白。
:::

这个模块可以给中英文之间加空格，并且会将标点符号修改正确，中文用中文符号，英文用英文符号。不过对于引号和括号，目前无法实现自动转换。除此之外，还会删除中文之间的空格，以及重复的空格。

## 预设

1. 去除全部空格：有时候 PDF OCR 后会出现大量的空格，可以使用这个功能来去除全部空格，但是仅限于没有单词的情况下，否则单词会合在一起。
2. 半角转全角：中文使用全角符号，英文使用半角符号。
3. 中英文加空格
4. 去除中文间空格。
5. 去除重复空格: 将连续多个空格变为 1 个。

开启多个预设，会从上到下依次执行。

## 自定义

::: warning 输入格式
[Replace() 函数格式——替换](../custom.md#replace-函数)
:::

## 英文标题规范化

**Powered by [to-title-case](https://github.com/gouch/to-title-case)**

开启该选项后，AutoFormat 会按照规则将自动生成的标题规范化。请注意，是自动生成的标题，即通过 [Another AutoTitle](anotherautodef.md)，[Another AutoDef](anotherautodef.md) 以及 [AutoComplete](autocomplete.md) 生成的标题。

::: warning 注意
标题会首字母大写。但是如果标题全部大写，说明是开启了 MarginNote 首页设置里的标题大写。
:::

**规则：**

1. By default, capitalize all words
2. Always capitalize the first and last word in titles and subtitles
3. Capitalize both parts of hyphenated words
4. Lowercase articles: a, an, the
5. Lowercase conjunctions: and, but, or, nor
6. Lowercase short prepositions: as, at, by, for, in, of, on, per, to, via
7. Lowercase versus: vs., vs, v., v
8. Lowercase NYT words\*: en, if
9. Let intentional capitalization stand

## [MarginNote for Card](magicaction4card.md#优化摘录排版)

### 优化摘录排版

使用预设以及自定义进行优化。只能优化摘录和标题，无法优化评论，他们间的 [区别](../concept.md#摘录笔记卡片评论) 可以点击查看。

- 标题：如果开启了 `英文标题规范化`，此时优化标题会也进行英文标题规范化。
- 摘录
