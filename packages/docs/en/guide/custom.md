# Custom Input Format

There are a lot of input field to customize in OhMyMN. They are mainly in three forms:

1. Regular Expression
2. Replace() Method
3. Template

Besides, since multiple regular expressions or Replace() Method can be set at the same time and there are also issues with the order of execution, it can be troublesome to enter in OhMyMN's input box, so I have creatively used MarginNote's mindmap card as a custom input box.

Of course, for all customization, I don't recommend that you type it directly in the OhMyMN input box, but write it elsewhere and paste it in, because OhMyMN doesn't save input in real-time, and you need to hit "enter" at the end to make sure it is saved.

## Regular Expression

[Regular Expression](regex.md) has two roles：

1. Determine if the conditions are met: for example, in [Another AutoTitle](modules/anotherautotitle.md) it is used to determine whether something can be turned into a title
2. As a delimiter, splitting a paragraph into multiple parts: for example, in [Another AutoDef](modules/anotherautodef.md) you can customize the split between the definition and the defined term.

There are 6 types of input formats:
1. String `xxx`. This is not simply omitting `//` . Special characters in regular cannot be used here. It is usually used to match a word directly.
2. Regular Expression `/xxx/`
3. Regular expression arrays `[/xxx/, /yyy/]`.`,` is the delimiter for `and` operator
4. Multiple regular expressions `/xxx/; /yyy/`. `;` is the delimiter for `or` operator. If one regex is matched, then this is considered to be a successful match.
5. Multiple regular expression arrays `[/xxx/, /yyy/]; [/xxx/]`. `;` is the delimiter for `or` operator. It is recommended to use this writing style to avoid most parsing errors.
6. Regular expressions and regular expression arrays `[/xxx/, /yyy/]; /xxx/; /yyy/`. `;` is the delimiter for `or` operator.

If special circumstances arise, I will note them in the respective places.

## Replace() Method

[replace()](replace) function actually corresponds to an input format. `(regex, newSubStr)` is one regular expression and one string.

For example, `(/regex/, "newSubStr")`.

The first step is to make a pattern match to see if conditions are met. If so,

1. [Replace](replace.md#replace) replaces the matched part with `newSubStr` and returns the replaced content.
2. [Extract](replace.md#extract) returns `newSubStr`。

Actually, there is a third parameter in `(regex, newSubStr, fnKey)`. `fnKey` is an integer, such as in `(/xxx/, "yyy", 0)`. It is just that `FnKey` is defaulted to 0, which can be omitted. I will note this when it is used for special occasions.

You can write multiple functions separated by `;`. For example:
- `(/xxx/, "111"); (/yyy/, "222")`
- `(/xxx/, "111", 1); (/yyy/, "222")`

## MNLink

An MNLink looks like this `marginnote3app://note/F20F324D-61B3-4CA9-A64C-0C92645A1E33`, also known as the note URL. It can be obtained here:

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221105224219.png?x-oss-process=base_webp)

As mentioned above, either `/xxx/` or `(/xxx/, "yyyy")` can be multiple using `;` separations. I creatively used the mindmap cards as editors, so that each regular expression can be easily disabled or enabled. You modify their order of precedence with ease.

Simply create a card as an input field, copy its MNLink, and fill it into the corresponding input box (MNLink is supported for both formats above). The first comment of the child card will be read, and the comments of all child cards will be combined by `; ` to construct the final input.

::: warning

If you change the content on the card, OhMyMN cannot read it automatically. You must manually hit "enter" where you fill in the customization to update the configuration, and OhMyMN will check if it was entered correctly.

:::

::: tip The disabled color is
in the 4th row and 2nd column
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221105225243.png?x-oss-process=base_webp)

In the current version, MagicAction also supports MNLink and does not even require that it conform to either of the 2 formats.

## Template

::: v-pre
There's not much to say about this one, it's just `{{variable}}`. Please refer to [Template Syntax](mustache.md) and [Template Variable](vars.md).
:::