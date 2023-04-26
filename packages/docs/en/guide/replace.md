# Replace() Method

In order to make OhMyMN more free and powerful, many customizations in OhMyMN use [replace() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) as drivers. This allows you to do almost anything with the excerpt text, but to avoid more of the ambiguity of crashing the plugin, <u>OhMyMN restricts functions as arguments and supports only regular expressions</u>.

## Replace

[Replace() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) is used to replace the matched content with the given string, and then return all the replaced content.

::: tip Input format

```js
(/regex/, "newSubStr")
```
:::

- `regex` is [Regular Expression](regex), used to match content which you want.
- `newSubStr` is a norma string, used to replace matched content.

In the `newSubStr`, you can use some variables to refer to the matched content or other content.

1. `$&` matched substring.
2. `` $` `` the portion of the string that precedes the matched substring.
3. `$'` the portion of the string that follows the matched substrng.
4. `$n` the nth (1-indexed) capturing group where n is a positive integer less than 100.
5. In the OhMyMN v4, templates variables are also available in some cases, click to view [Template Syntax](mustache.md)。

## Extract

All extraction operations in OhMyMN return `newSubStr` directly as a value. This is equivalent to returning `newSubStr` whenever a regular match is found, and using the capture group, you can also capture it and return it. To achieve this effect, you need to use the [match() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match). Of course, you don't need to know this. Just use the same syntax as for the previous substitution, except that `newSubStr` will be returned at the end instead of the whole replaced string.
