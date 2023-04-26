# AutoTag

Specified tags are automatically added if a regex is matched, and specific content can also be extracted from the excerpt as tags.

## Custom

::: warning Input Format
[Replace() Method Format —— Extract](../custom.md#replace-method)
:::

**Example**

- `(/^.+$/gs, "This is an example")` and could add four tags each time, such as "#This #is #an #example".
- `(/@picture/gs, "This is a picture")` and could add a tag for "This is a picture" when you excerpt a picture。

## [MagicAction for Card](magicaction4card.md#add-tag)

### Add Tag

::: warning Input Format
[Replace() Method Format —— Extract](../custom.md#replace-method)
:::

Since in most cases it's just to add tags without extracting them, you can just type in the tag content.
