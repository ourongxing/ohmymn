::: v-pre

# Template Syntax

OhMyMN has added the Mustache template engine in v4. If you're familiar with Anki templates, you'll see that Anki actually uses the same one. The logo is the two bearded `{{}}`. Compared to the previous [AutoComplete](./modules/autocomplete.md) or [CopySearch](modules/copysearch.md) template engines I implemented myself, Mustache is more powerful and brings support for arrays, objects, and functions.

## Where It Can Be Used

1. [AutoComplete](modules/autocomplete)
2. [CopySearch](modules/copysearch)
3. ~~Export to Anki~~
4. ~~Export to Flomo~~

Actually, not only that, OhMyMN v4 integrates templates with the [Replace()](replace) Method, and you can use templates in `newSubStr`. It doesn't make sense to use it anywhere, though, so I've restricted the area of use.

1. [Another AutoDef](modules/anotherautodef): Custom Title Extraction.
2. [AutoTag](modules/autotag.md): Custom
3. [AutoReplace](modules/autoreplace.md): Custom
4. [AutoComment](modules/autocomment.md): Custom
5. [MagicAction for Card](modules/magicaction4card)
   - Rename Titles
   - Extract Titles
   - Add Comments
   - Add Tags
   - Replace Excerpt Content

Data from the current card or extracted notes are used everywhere except for AutoComplete where the data comes from the dictionary, see [Template Variable](vars.md) for details.


## Addtional but Important
1. Since Mustache is originally used for HTML templates, by default the parsed text will be HTML escaped. But we don't need it here, so I changed the source code to not escape by default, if you need to escape, you can use `{{{titles}}}` or `{{& titles}}`.
2. Use an array variable directly, the array elements will be merged into a string by `;`. This is not the same as Mustache.

---

::: tip
The contentn below is just my notes on learning Mustache. It may not be helpful to you, but if you need learn Mustache in detail, just search for Mustache on Google.
:::
## Variable

所谓变量嘛, 就是 key-value。输入 key，解析出来就成了 value。

要使用一个变量，直接 `{{titles}}` 即可，你就可以获取到这张卡片的标题。如果你变量名写错了，或者这个变量没有值，就整体为空。


## Object

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

## If/Else

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

## List/Array

::: tip
在代码世界里，一个数组或者列表都是从 0 开始数的。
:::

::: v-pre
这是我换成 Mustache 的最大原因。数组也是变量，以前只能用 `title_1`，`tag_1` 表示第一个标题，第一个标签，现在可以使用 `titles.0`，`tags.0` 来表示。当然也可以 `titles.1` `titles.2`。

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

更神奇的是如果一个数组是对象数组，比如 [Template Variable](vars) 里的 `children` 变量，他是一个对象数组，每一个元素都有 `titles` 属性，类似

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

## Function

函数也非常有用，在 [Template Variable](vars#函数) 中，提供了很多函数。就已 `nohl` 举例吧。

默认情况下，如果你在 MarginNote 中划了重点，插件获取的重点就会变成 `**重点**`，这其实是 Markdown 里的语法。如果是直接在 Markdown 中粘贴就还好，但是粘贴到其他不支持 Markdown 的软件中，就比较不舒服了。

之前的解决办法是用两个变量，一个表示有 `**`，一个表示没有 `**`。现在你可以这样：

```js
{{#nohl}}{{excerpts}}{{/nohl}}
```

就可以把 `excerpts` 里的所有 `**` 给删除。当然，你还可以用 `cloze` 将 `**重点**` 全部换成 `{{c1:重点}}`，快去试试吧。

:::
