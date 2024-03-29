# 自定义输入格式

OhMyMN 中有大量的自定义，方便你定制。主要是三种格式：

1. 正则表达式
2. Replace() 函数
3. 模版

另外，由于正则表达式或者 Replace() 函数可以同时设置多个，也会涉及到执行顺序等问题，在 OhMyMN 的输入框中输入会比较麻烦，所以我创造性的将 MarginNote 的脑图卡片作为了自定义的输入框。

当然，我建议不管是自定义什么，都不要在 OhMyMN 的输入框中直接输入，而是其他地方写好了再粘贴进来。因为 OhMyMN 不是实时保存，最后需要敲回车确定后才会保存。

## 正则表达式

[正则表达式](regex.md) 有两个作用：

1. 判断是否满足条件，比如 [Another AutoTitle](modules/anotherautotitle.md) 中用来判断是否可以转为标题。
2. 作为分割点，将一段话分割为多个部分，比如 [Another AutoDef](modules/anotherautodef.md) 自定义定义联项，将定义分为定义项和被定义项两部分。

有六种输入格式：

1. 字符串 `xxx`，并非只是省略 `//` ，这里无法使用正则里特殊的字符。一般是用来直接匹配某个词。
2. 正则表达式 `/xxx/`。
3. 正则表达式数组，`[/xxx/, /yyy/]`，`,` 隔开。`与` 的关系，也就是全部匹配才算匹配成功。
4. 多个正则表达式 `/xxx/; /yyy/`，`;` 隔开。`或` 的关系，一个匹配就算匹配成功。
5. 多个正则表达式数组，`[/xxx/, /yyy/]; [/xxx/]`，`;` 隔开。`或` 的关系。建议使用这种写法，可以避免掉大多数解析错误的情况。
6. 正则表达式和正则表达式数组，`[/xxx/, /yyy/]; /xxx/; /yyy/`，`;` 隔开。`或` 的关系。

如果特殊情况出现，我会在相应地方注明。

## Replace() 函数

[replace()](replace) 函数其实是对应着一种输入格式，`(regex, newSubStr)`，一个正则，一个字符串。
比如 `(/regex/, "newSubStr")`。

其作用首先是进行正则判断，看是否满足条件，如果满足，

1. [替换](replace.md#替换)，将正则匹配的部分替换为 `newSubStr`，返回替换后的内容。
2. [提取](replace.md#提取)，返回 `newSubStr`。

其实还有第三个参数，`(regex, newSubStr, fnKey)`，`fnKey` 为整数，比如 `(/xxx/, "yyy", 0)`。只是 `FnKey` 默认为 0，可以不用写，用于一些特殊的设置。用到时自会标注出来。

可以写多个，用 `;` 隔开，比如

- `(/xxx/, "111"); (/yyy/, "222")`
- `(/xxx/, "111", 1); (/yyy/, "222")`

## MNLink

所谓 MNLink 就是 `marginnote3app://note/F20F324D-61B3-4CA9-A64C-0C92645A1E33`，也就是笔记的链接。可以在这个地方获取到

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220506005857.png?x-oss-process=base_webp)

上面说了，不管是 `/xxx/` 还是 `(/xxx/, "yyy")` 都可以使用 `;` 隔开设置多个。我创造性的将脑图卡片当作了编辑器，这样就可以轻松停用或启用其中每一个正则。也可以修改他们的先后顺序。

只需要创建一张卡片作为读取点，复制它的 MNLink 填入到对应的输入框中（支持上面这两种格式的都支持 MNLink）。然后实际读取的是子卡片的第一条评论，会把所有子卡片的评论通过 `; ` 合并起来构造最终的输入。

::: warning 注意
如果你修改了卡片上的内容，OhMyMN 无法自动读取，你必须在填入自定义的地方手动敲一下回车来更新配置，同时会检查是否输入正确。
:::

::: tip 表示禁用的颜色是
第 4 排第 2 个
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220507095500.png?x-oss-process=base_webp)

在当前版本中，MagicAction 同样支持 MNLink，甚至不要求必须符合上面这两种格式。

## 模版

::: v-pre
这个就没什么好说的了，就是 `{{变量}}`，看 [模版语法](mustache.md) 以及 [模版变量](vars.md)。
:::