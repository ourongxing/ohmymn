# MagicAction for Card

Some actions related to cards (which are essentially buttons) are executed manually by first selecting the card (multiple selections are possible) and then clicking on the button. Other modules will also have some actions that will be explained here. These actions are bound to modules, using the same configuration, and the corresponding actions will be displayed here only after the module is enabled.

## Smart Selector

When you select a card with child nodes or select multiple cards at the same level that all have child nodes, OhMyMN will pop up a menu asking if the child or descendant nodes should be selected. This can be used for quick batch selection.

[Related concepts](../concept.md#cardnode-parentchild-card-ancestor-card-descendant-card) of parent and child nodes.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221104222124.png?x-oss-process=base_webp)

## Actions

### Manage Profile

::: warning Note
Please first read OhMyMN's [Profile Structure](../profile.md#profile-structure).
:::

1. Write profile: Write the profile to the child cards of the selected card. Please make sure that the selected card has child cards, the more child cards the better because this profile information will keep expanding to avoid exceeding the maximum number of words for one card.
   - All Profile
   - Global Profile 12345: The global profile can also continue to export the profile of a module separately.
   - Doc Profile
   - Notebook Profile
2. Read profile: Reads the profile from the card. It is possible to read the profile of only one module and write it to the specified global profile.
   - All Profile -> Global Profile -> Module Profile
3. Reset profile: Reset to the default profile.
4. Sync multi-window profile: OhMyMN does not synchronize the profile immediately in multi-window cases. You can force synchronization with this option.

### Filter Card

::: warning Input Format
[Regular Expression —— Match](../custom.md#regular-expression)
:::

You can filter titles, excerpts, comments, or tags separately. You can also continue to use other actions after filtering.

Although OhMyMN's selection is not the same as MarginNote's selection, you can't use the delete or cut function. However, there is always a way. You can add a special tag to the selected card and then filter it by the tag to quickly reselect it. Finally, you can delete this tag.

Similarly, OhMyMN cannot be filtered by color. You can add a special tag after filtering with MarginNote, then filter by OhMyMN and process it. Finally, just remove this tag.

### Merge Multiple Card

MarginNote's merge feature is lacking. It cannot merge titles and it merges titles into cards as comments. This feature solves three problems:

1. Merge titles
2. Other card titles cannot be added as comments.
3. Merge tags

### Rename Titles

This can be ranked in the top three most powerful features in OhMyMN, which is used for batch renaming, numbering, and hierarchical numbering of cards.

::: warning Input Format
[Replace() Method Format —— Replace](../custom.md#replace-method)
:::

Since most of the time the entire title is matched, the default regex is `/^. *$/`. You just need to enter a new title, and you can also use `$&` to quote the current title.

#### 1. Numbering

::: warning Input
`%["1"] $&`
:::

Here a magic variable is used `%["1"]`, which will be incremented on each call. Please check [syntax](../serial.md#1-和-1).

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/f85817a79fcba635afa7eb0de63d34f0ffbb9b48.gif?x-oss-process=base_webp)

#### 2. Hierarchical numbering

::: warning Input

`#["1"] $&`

The hierarchical numbering is for all its descendant nodes and will not be numbered itself. Please make sure the card has child nodes when using it.

:::

`#["1"]` is also a magic variable. Please check [syntax](../serial.md#1).

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/e8ae47a8999bb30794c70aba1b3c24da143f25cd.gif?x-oss-process=base_webp)

#### 3. Use Tag as Title

::: v-pre

::: warning Input

`{{tags}}`

:::

The template is used here. Please check [Template Syntax](../mustache.md) and [Template Variable](../vars.md).

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/f7ab0467646ca7b94a4ea9a560c016c9543.gif?x-oss-process=base_webp)

### Merge Text

Only text excerpts and text comments will be merged. Images and HTML comments (Markdown) are automatically topped. Tags and links are automatically bottomed.

You can set the before and after modifications here, such as numbering at the beginning and a line break at the end.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221106014745.png?x-oss-process=base_webp)

Default to `%["1"]. $&\n\n`

- `%["1"]` a magic variable, which will be incremented on each call. Please check [syntax](../serial.md#1-和-1)。
- `$&` indicates the current comment or excerpt.
- `\n` indicates a line break. This is used everywhere. in OhMyMN you use `\n` if you want a line break.

If you want to merge two paragraphs directly without gaps, just type `$&`.

**Options:**

- Excerpts can be further manipulated using other functions in MagicAction, while the emphasized content will be retained.
- Merge as comments.

### Switch Excerpt / Title

- Switch to Non-Existent
- Swap Title and Excerpt: When only one title or excerpt is present, it is the same as `Switch to Non-Existent`. In the case of both title and excerpt, there will be the following processing:
   - Excerpt → Title
   - Excerpt ← Title
   - Excerpt ⇄ Title

### Extract Title

From [Another AutoDef](anotherautodef.md#extract-title)

### Split Excerpt Text

From [Another AutoDef](anotherautodef.md#split-excerpt-text)

### Format Excerpt Text

From [AutoFormat](autoformat.md#format-excerpt-text)

### Generate Word Card

From [AutoComplete](autocomplete.md#generate-word-card)

### Replace Excerpt Text

From [AutoReplace](autoreplace.md#replace-excerpt-text)

### Add Line Break

From [AutoList](autolist.md#add-line-break)

### Modify Excerpt Color

From [AutoStyle](autostyle.md#modify-excerpt-color)

### Modify Excerpt Style

From [AutoStyle](autostyle.md#modify-excerpt-style)

### Search Card Content

From [CopySearch](copysearch.md)

### Copy Card Content

From [CopySearch](copysearch.md)

### Add Tag

From [AutoTag](autotag.md#add-tag)

### Translate Excerpt Text

From [AutoTranslate](autotranslate.md#translate-excerpt-text)
### Add Comment

From [AutoComment](autocomment.md#add-comment)

### Covert to Simplified Chinese

From [AutoSimplify](autosimplify.md)
