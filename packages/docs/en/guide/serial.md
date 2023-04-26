# Auto Numbering

Automatic numbering is used everywhere in OhMyMN, such as numbering card titles and even hierarchical numbering. When merging text within a card, you can add a number to each comment, and when searching or copying the contents of multiple cards in CopySearch, you can also number the contents of each card.

::: v-pre
Three different ways of writing will appear in use:

1. `%["1"]`: Used in [Rename titles](modules/magicaction4card.md#rename-titles) to numbering each card titles. also in [Merge Text](modules/magicaction4card.md#merge-text) and [CopySeach](modules/copysearch.md).
2. `$["1"]`: Essentially the same as `%["1"]`,  will be used in [Template Function —— join](vars.md#function). As for why different prefixes are set, because both may be used in [Rename titles](modules/magicaction4card.md#rename-titles).
3. `#["1"]`: Number the subcards of the selected card hierarchically in [Rename Titles](modules/magicaction4card.md#rename-titles).

:::

## `%["1"]` & `$["1"]`

These two are used in exactly the same way, so let's take `%["1"]` as an example.

### Starting Value and Symbol Type

First of all, the 1 in this `"1"` can be variable, it can be 2, it can be 100, it can even be `001`, giving the number the complementary 0 so that all numbers can reach the same width, which is the starting value.

Not only that, but also different numbering symbols:

- `①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿`
- `❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴`
- `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- `abcdefghijklmnopqrstuvwxyz`
- `壹贰叁肆伍陆柒捌玖拾`
- `一二三四五六七八九十`
- `ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ`
- `ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ`

So the `"1"` determines both the symbol type and the starting value of the number. Just copy and replace it when you use it. Note, however, that if the numbering is insufficient, it will start from the beginning.

### Step Length

`%["1"]` written in full as `%["1",1]`，the last `1` is step lenght, which not wrapped by double quotes. The step is the interval, and step 1 is the default value, so it can be omitted.

If you want to numbering as `1 11 21 31`, you can use `%["1",10]`.

### Custom Numbering Symbols

If you want to use a specified set of numbering symbols, then you can use the `%["aaa", "bbb", "ccc", "ddd", "eee", "fff"]`。

## `#["1"]`

Only the [rename titles -- hierarchical numbering](modules/magicaction4card.md#rename-titles) is currently in use.

`#["1"]` written in full as `#["1","1","1","1",[".",4, false]]`

Indicates that the first layer starts from `1`, the second layer starts from `1`, and the third and fourth tiers also start from `1`. If there are layers after that, the default is to use the last starting value provided, which is `1`. You can set as many layers as your mindmap has here, which means you can set the numbering symbols for each layer individually. It supports all the numbering symbols mentioned above, but does not hold itself to set the step size and does not support custom numbering symbols.

### Options Array

The last `[".", 4, false]` is options array. The three elements represent `Connection Symbol`, `Max Numbering Layer`，`Only Show Current Layer Number`. All can be omitted, no order is required. The default value is `[".",999,false]`.

- `Connection Symbol` is a string, wrapped by double quotes.
- `Max Numbering Layer` is a number. If the entire mindmap has 10 layers, you can use this setting to limit the numbering to 4 layers. Usually only three layers need to be numbered.
- `Only Show Current Layer Number` is a boolean `true/false`. By setting it to `true`, only one number will be displayed for each level, without adding the number of its parent card. `1.1.2` -> `2`
