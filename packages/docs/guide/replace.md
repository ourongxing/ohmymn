# Replace() 函数

为了使 OhMyMN 更加自由，更加强大，OhMyMN 中很多自定义都采用 [Replace()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 函数作为驱动。这使得你几乎可以对摘录进行任何处理，不过为了避免更多的导致插件崩溃的不确定因素，<u>OhMyMN 限制了将函数作为参数，以及仅支持正则表达式</u>。

## 替换

[Replace()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 函数的作用其实就是将匹配到的内容替换为给的文字，然后返回替换后的所有内容。
::: tip 输入格式
```js
(/regex/, "newSubStr")
```
:::

- `regex` 是 [正则表达式](regex)，用来匹配需要替换的内容。
- `newSubStr` 为普通字符串，需要使用双引号包裹，比如`"xxx"`，表示想要替换成的内容。
在 `newSubStr` 中，可以使用一些变量，来引用匹配到的内容：

1. `$&` 表示匹配的字符串。
2. `` $` `` 表示匹配的字符串前面的内容。
3. `$'` 表示匹配的字符串后面的内容。
4. `$n` 如果你在 `regex` 中使用了[捕获组](regex#分组)，你就可以用 `$+数字` 来引用你捕获的内容。
5. 在 v4 版本中，某些情况下还可以使用模版变量，点击查看 [模版语法](mustache.md)。

## 提取

OhMyMN 中所有的提取操作都是直接将 `newSubStr` 作为了返回值。相当于只要正则匹配到了就返回 `newSubStr`，而使用捕获组，还可以将其捕获并返回。能实现这个效果，其实还需要用到 [Match()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 函数。当然，这个你不需要了解。只需要按照前面替换的语法一样使用即可，只是最后会返回 `newSubStr` 而不是整个字符串。
