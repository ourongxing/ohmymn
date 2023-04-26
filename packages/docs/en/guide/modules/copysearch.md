# CopySearch

::: tip
CopySearch doesn't begin with “Auto”, which means it can't be executed automatically while excerpting, but can be executed by gestures or manual clicks in MagicAction.
:::

CopySearch allows you to search and copy everything on this card, whether it is a visible excerpt or title, the invisible URL, or the modification time. You can also freely combine various attributes. With custom URLs, pass this information into other software. Whether for export or searching, everything is possible.

## Select Card Content

The composition of a card is very complex, and it may be that the card OhMyMN sees is different from the one you see. A card can have multiple titles, multiple excerpts, and multiple comments in it. When you search or copy, how to select precisely what you want?

The solution given by CopySearch is `Dynamic Selection`.

::: tip
`Default Content To Search` is only for `Search Card Content`. `Copy Card Content` will pop up when it is executed so that it can be easily done in one step with different gestures. Since `Search Card Content` has to select both the search content and the search engine, I think it would be important to have different gestures for different search engines.
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731122447.png?x-oss-process=base_webp)

`Dynamic Selection` will give you all titles, all excerpts, and customizations for you to choose from when searching.

In addition, there are three options:

- Title First
- Excerpt First
- Custom

Why is it First? When the priority queue is empty, it will follow Title->Excerpt->Custom, recursively downwards until something that is not empty appears.

### Custom

::: warning Custom Format
[Template](../custom.md#template)
:::

::: v-pre

- For example, the most commonly used MarkDown format MNLink: `[{{titles.0}}]({{url.pure}})`
- Or the first comment: `{{comments.text.0}}`

### Multiple Cards

If multiple cards are selected, there is no way to dynamically select them, and it defaults to the first card. For multiple cards, whether searching or copying, the specified contents of all cards are combined, not individually.

Here it involves numbering or line breaks when merging. This is similar to [MagicAction for Card - Merge Text](magicaction4card.md#merge-text) It can be completely copied over, so I won't say much here.

## Search URL

This can be a URL or a URL Scheme for other software.

1. [URL Schemes Usage Explained -  sspai](https://sspai.com/post/31500#07)

2. [Getting Started with iOS Automation: Reading URL Schemes - sspai](https://sspai.com/post/44591)

3. [URL Scheme Query Guide - sspai](https://sspai.com/post/66334)

Format: Replace the part of the URL search keyword with `{{keyword}}`

- Eurodictionary: `eudic://dict/{{keyword}}`
- Specify Edge browser to use Baidu search engine: `microsoft-edge-https://baidu.com/s?wd={{keyword}}`
