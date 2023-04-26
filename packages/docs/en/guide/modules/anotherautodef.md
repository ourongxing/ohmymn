# Another AutoDef

The difference between this function and [Another AutoTitle](anotherautotitle.md) is that Another AutoTitle is mainly used to convert excerpts to titles, while Another AutoDef uses part of the excerpt as the title and the remaining content as the excerpt, which plays a splitting and extracting role.

As for why it is called AutoDef, it is because this function is most often used for definition.

::: tip The definition of "definition"
The word or group of words that is to be defined is called the `definiendum`, and the word, group of words, or action that defines it is called the `definiens`. For example, in the definition "An elephant is a large gray animal native to Asia and Africa", the word "elephant" is the definiendum, and everything after the word "is" is the definiens. And "is" is called `definition connective`
:::

This definition connective can either be used as a splitting point to divide content into two parts, the title and the excerpt, or it can be used to determine whether the excerpt is a definition or not, so that it can be processed automatically.

## Preset

::: tip
The current presets are for Chinese only. Welcome to submit your presets on Github.
:::

I have set up a few commonly seen connectives. It will be restrained to avoid affecting the normal excerpting behavior. `xxx` is the definiendum and `yyy` is the definiens.

Note: some regex contain/are designed for Chinese text

- xxx : yyy `/[：:]/`
- xxx —— yyy `/[一\-—]{1,2}/`
- xxx ，是(指) yyy `/[,，]\s*(?:通常|一般)*是指?/`
- xxx 是(指)， yyy `/(?:通常|一般)*是指?\s*[,，]/`
- xxx 是指 yyy `/(?:通常|一般)*是指/`
- yyy，\_\_\_称(之)为 xxx `/[,，].*称之?为/y`
- yyy(被)称(之)为 xxx `/(?:通常|一般)?被?称之?为/y`


## Custom Definition Connective

::: warning Custom formats
[Regular Expression —— Split](../custom.md#regular-expression)
:::

I've written the regular expressions behind the above presets clearly, and you can customize the connectives you need. Here's how it works: [split function](... /split.md), which uses the connective as a splitting point, and naturally divides the definition into the definiendum and the definiens.

As you may have noticed, the last two rules in the presets use a flag `y`, and they both belong to the case where the definiendum comes after it. `y` is rarely used in the regular, so I've included it as a parameter. Whenever you use`y`, AutoDef will automatically swap the definiendum and definiens.

## Custom Titles Extraction

::: warning Custom Formats
[Replace() Method Format —— Extract](../custom.md#replace-method)

Note: If you use regular expression arrays, such as `[/test1/, /test2/]`, the `/test1/` will be the main regex to split the content, and the `/test2/` will be used to restrict `/test1/` matched.
:::

Extract the title directly from the excerpt.

The third parameter of this format `fnKey` is used here.

- The default is 0, which can be omitted, meaning that the excerpt content is retained. However, if you enter 1, the excerpt content will not be retained.

## Custom Alias Separator

Defined items usually have alias in them, and if you turn on the `Convert Alias To Muilt Titles` option, AutoDef will automatically split them into multiple titles to be used for title links.

Default separator:

- Default: `/或者?|[简又]?称(?:之?为)?/`
- Punctuation Marks: `/[、。,，‘’“”"『』()（）【】「」《》«»\/\[\]]/`

::: warning Custom Formats
[Regular Expression —— Split](../custom.md#regular-expression)

Note: If you use regular expression arrays, such as `[/test1/, /test2/]`, the `/test1/` will be the main regex to split the content, and the `/test2/` will be used to restrict `/test1/` matched.
:::


## [MagicAction for Card](magicaction4card.md#extract-title)

### Extract Title

::: warning Custom Formats
[Replace() Method Format —— Extract](../custom.md#replace-method)
:::

- `Use the Configuration of AutoDef`: uses the custom regex entered in `Custom Title Extraction`.

### Split Excerpt Text

::: warning Custom Formats
[Regular Expression —— Split](../custom.md#regular-expression)
:::

- `Use the Configuration of AutoDef`: Split using the presets in AutoDef, excluding `Custom Title Extraction`.

If the card already has a title, it will be automatically merged.
