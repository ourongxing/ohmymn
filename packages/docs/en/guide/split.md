# Split() Method

[Split() method](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split) is currently only used in [Another AutoDef](modules/anotherautodef) to split the excerpt text into two parts: the title and the excerpt.

Just provide a [Regular Expression](regex) as the split point to split the string in two parts.

if you use a capture group in your regular expression, it puts the captured content in the split result, resulting in a split into three parts. If you have to group, you can use a non-capture group.

There is actually a benefit to capture groups, which is when you can't find a clear split, such as a multiple-choice question where you want to use the question as the title and the options as excerpts. That's when you have to use the capture group and the capture is all the options.

[definiendum, definiens] ⇒ [definiendum, capture group]

In addition, the capture group allows you to restrict the definiendum or definiens.
