::: v-pre

# 模版语法

OhMyMN 在 v4 版本中加入了 Mustache 模版引擎。如果你熟悉 Anki 模版，就会发现其实 Anki 用的也是这个。标志就是两个大胡子 `{{}}`。相较于之前 [AutoComplete](modules/autocomplete) 或者 [CopySearch](modules/copysearch) 我自己实现的模版~~引擎~~，Mustache 更加强大，带来了数组，对象，函数的支持。

## 在哪里可以使用

1. [AutoComplete](modules/autocomplete)
2. [CopySearch](modules/copysearch)
3. ~~Export to Anki~~
4. ~~Export to Flomo~~

其实不仅如此，OhMyMN v4 将模版与 [Replace()](replace) 函数相融合，你可以在 `newSubStr` 中使用模版。不过并不是任何地方使用都有意义，所以我限制了使用区域。

1. [Another AutoDef](modules/anotherautodef)：提取或设置标题。
2. [AutoTag](modules/autotag.md)：提取或设置标签。
3. [AutoReplace](modules/autoreplace.md)：修改摘录内容。
4. [AutoComment](modules/autocomment.md)：提取或设置评论。
5. [MagicAction for Card](modules/magicaction4card)
   - 重命名标题
   - 提取标题
   - 添加标签
   - 添加评论
   - 替换摘录文字

除了 AutoComplete 的数据来自于词典，其他地方均使用当前卡片或摘录笔记的数据，详细内容请查看 [模版变量](vars.md)。


## 补充知识
1. 由于 Mustache 最初是用在 HTML 模版上，所以默认情况下解析出来的文本都会进行 HTML 转义。但我们这里用不着，所以我修改了下源码，改为了默认不转义，如果需要转义，可以使用 `{{{titles}}}` 或 `{{& titles}}`。
2. 直接使用一个数组变量，数组元素会通过 `;` 合并成一个字符串。这和 Mustache 不一样。

## 变量

所谓变量嘛, 就是 key-value。输入 key，解析出来就成了 value。

要使用一个变量，直接 `{{titles}}` 即可，你就可以获取到这张卡片的标题。如果你变量名写错了，或者这个变量没有值，就整体为空。


## 对象

对象可以有很多变量, 比如
```
obj = {
  key1: "value1",
  key2: "value2",
}
```
你可以使用

```js
{{#obj}} {{key1}} {{key2}} {{/obj}}
> value1 value2
```
## 条件

可以把变量作为一个判断条件，像下面这样，包裹住一些文字或者变量，如果这个变量为空，那么整体就为空。有点类似 HTML 标签 `<a></a>`，以反斜杠结束。

```js
{{#titles}}有标题{{/titles}}
{{#titles}}有标题 {{id}}{{/titles}}
```

还可以当某个变量为空时才显示里面的内容，可以这样，把 `#` 换为 `^`。

```js
{{^titles}}没有标题{{/titles}}
{{^titles}}没有标题 {{id}}{{/titles}}
```

这样其实也就实现了 `if-else` 的效果。
:::

## 数组/列表

::: tip
在代码世界里，一个数组或者列表都是从 0 开始数的。
:::

::: v-pre
这是我换成 Mustache 的最大原因。以前只能用 `title_1`，`tag_1` 表示第一个标题，第一个标签，现在可以使用 `titles.0`，`tags.0` 来表示。当然也可以 `titles.1` `titles.2`。

默认情况下，一个数组 `{ titles: ["aaa", "bbb", "ccc", "ddd"] }`，如果直接这样使用，输出的结果会用 `; ` 隔开。

```js
{{titles}}
> aaa; bbb; ccc; ddd
```

通常是像下面这样给循环渲染出来，用 `{{ . }}` 来表示数组内的每一项 ：

```js
{{#titles}}{{.}}, {{/titles}}
> aaa, bbb, ccc, ddd,
```

其实这不是很智能，最后会多出一个 `,` 。这时候我们可以用自定义的 [join 函数](vars.md#函数)，`{{#join}}{{titles}}, {{/join}}`

更神奇的是如果一个数组是对象数组，比如 [模版变量](vars) 里的 `children` 变量，他是一个对象数组，每一个元素都有 `titles` 属性，类似

```js
{
  children: [
    {
      titles: ["aaa", "bbb"]
    },
    {
      titles: ["ccc", "ddd"]
    }
  ]
}
```

那么我们可以这样写：

```js
{{#children}}{{titles}}\n{{/children}}
>   aaa; bbb
    ccc; ddd
```

:::
## 函数

函数也非常有用，在 [模版变量](vars#函数) 中，提供了很多函数。就已 `nohl` 举例吧。

默认情况下，如果你在 MarginNote 中划了重点，插件获取的重点就会变成 `**重点**`，这其实是 Markdown 里的语法。如果是直接在 Markdown 中粘贴就还好，但是粘贴到其他不支持 Markdown 的软件中，就比较不舒服了。

之前的解决办法是用两个变量，一个表示有 `**`，一个表示没有 `**`。现在你可以这样：


::: tip 更新
[v4.2.0](/update.md) 使用新的函数语法，支持函数参数。
:::

::: v-pre

```js
// 新写法
{{ excerpts.text.0 | nohl}}
// 旧写法
{{ #nohl }}{{ excerpts.text.0 }}{{ /nohl }}
```


就可以把 `excerpts` 里的所有 `**` 给删除。当然，你还可以用 `cloze` 将 `**重点**` 全部换成 `{{c1:重点}}`，快去试试吧。

:::