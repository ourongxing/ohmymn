# CopySearch

::: tip
CopySearch 没有以 Auto 开头，说明没法摘录时自动执行，可以通过手势或者在 MagicAction 中手动点击执行。
:::

CopySearch 可以让你搜索和复制这张卡片上的一切，不管是看得见的摘录或者标题，还是看不见的 URL 或者修改时间。你还可以将各种属性进行自由组合，通过自定义 URL，将这些信息传入其他软件中，不管是导出还是搜索，一切都有可能实现。

## 选择卡片内容

卡片的组成非常复杂，可能 OhMyMN 看到的卡片和你眼中的卡片还有所不同，一张卡片中可以有多个标题，多个摘录，多个评论。当你搜索或者复制的时候，如何精准选中你真正想要的。

CopySearch 给出的解决方案是 `动态选择`

::: tip
`默认搜索卡片内容` 只针对 `搜索卡片内容`。`复制卡片内容` 会在执行时弹出该选项，这样方便通过不同手势一步到位。由于 `搜索卡片内容` 既要选择搜索内容，也要选中搜索引擎。我觉得给不同搜索引擎设置不同手势会更重要一点。
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731122447.png?x-oss-process=base_webp)

`动态选择` 会给出所有标题，所有的摘录以及自定义，让你在搜索的时候进行选择。

除此之外，还有三个选项:

- 优先标题
- 优先摘录
- 自定义

为什么是优先，当优先的内容为空时，就会按照 标题->摘录->自定义，往下递推，直到有不为空的出现。

### 自定义

::: warning 自定义格式
[模版](../custom.md#模版)
:::

::: v-pre

- 比如最常用的 MarkDown 格式 MNLink: `[{{titles.0}}]({{url.pure}})`
- 再或者是第一条评论: `{{comments.text.0}}`

::: tip 更新
[v4.0.6](/update.md) 改进：自定义复制和自定义搜索可以单独设置。
:::

### 多张卡片

如果选中了多张卡片，就没法动态选择了，就默认第一个。对于多张卡片，不管是搜索还是复制，都是将所有卡片的指定内容合并在一起，而不是单独复制或搜索。

这里涉及到了合并时进行编号或者换行。这个和 [MagicAction for Card -- 合并卡片内文字](magicaction4card.md#合并卡片内文字) 其实是一样的，完全可以照搬过来，这里就不多说了。

## 搜索 URL

可以是网址，也可是其他软件的 URLScheme。

1. [URL Schemes 使用详解 - 少数派](https://sspai.com/post/31500#07)

2. [入门 iOS 自动化：读懂 URL Schemes - 少数派](https://sspai.com/post/44591)

3. [URL Scheme 查询指南 - 少数派](https://sspai.com/post/66334)

格式：将 URL 搜索关键词的部分换成 `{{keyword}}`

- 欧陆词典：`eudic://dict/{{keyword}}`
- 百度搜索：`https://www.baidu.com/s?wd={{keyword}}`

  - 指定 Edge 浏览器打开百度搜索：`microsoft-edge-https://baidu.com/s?wd={{keyword}}`
