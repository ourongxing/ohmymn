# AutoStyle

AutoStyle allows you to set and fix the default colors and styles for text excerpts and image excerpts (Rect and Lasso) respectively. Colors and styles can also be set automatically based on various presets.

### Preset

::: warning
OhMyMN can only be triggered when excerpting or modifying excerpts. Dragging cards and merging cards will not trigger OhMyMN, but you can use gestures with `Modify Excerpt Color - Use AutoStyle Settings` to refresh the color.
:::

There are four presets. One on style and three on color.

1. The style is determined by the number of words or area: Once the number of words or the area is large, if you use fill, there will be a large area of color blocks, which is very distracting, so you should switch to the wireframe style at this time.

    - Input: `[Chinese character-like word count, English word-like word count, selection area]`
    - The word count here is the same concept as in [Another AutoTitle](anotherautotitle.md#预设).
    - The selection area can be obtained by turning on `Show Excerpt Area`.

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804014354.gif?x-oss-process=base_webp)

---

::: tip
The color presets have priority. `Color Follows Card` ⇒ `Color Follows Sibling Card` ⇒ `Color Follows Parent Card` ⇒ `Default`

When all three presets are enabled, if the excerpt is merged into a card, its color will follow the card. If it serves as a child node, and if it has any sibling card, it will follow the sibling card; if not, it will follow the parent card.
:::

2. Color follows card: Set the option below (MarginNote Home Screen Settings) to `Merge In` to automatically change into color to the color of the card that the excerpt is drag-and-dropped and merged into when excerpting.

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804004454.png?x-oss-process=base_webp)

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804014701.gif?x-oss-process=base_webp)

3. Color follows sibling cards: The so-called sibling cards are the cards of the same parent card. I set it to follow the first sibling card. The best way to use this preset is to set the top option to `Add as Child Node`.

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804015210.gif?x-oss-process=base_webp)

4. Color follows parent card: Set the above option to `Add as Child Node` to follow its parent card.

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804015411.gif?x-oss-process=base_webp)

## [MagicAction for Card](magicaction4card.md#modify-excerpt-color)

### Modify Excerpt Color

- Enter the color index, 1-16, which is the color palette from left to right, top to bottom.
- `Use AutoStyle Settings`: Use the presets to refresh the color.

### Modify Excerpt Style
- `Use AutoStyle Settings`: Use the presets to refresh the color.