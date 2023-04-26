# AutoComment

在匹配到正则的情况下自动添加指定评论，也可以从摘录中提取特定内容为评论。

## 自定义

::: warning 输入格式
[Replace() 函数格式——提取](../custom.md#replace-函数)
:::

**例**

- `(/^.+$/gs, "这是一个例子")` 即可每次都添加一条评论为“这是一个例子”。

::: tip 更新
[v4.0.11](/update) 支持图片摘录自动添加评论。
:::

- `(/@picture/gs, "这是一张图片")` 摘录图片时自动添加评论。

## [MagicAction for Card](magicaction4card.md#添加评论)

### 添加评论

::: warning 输入格式
[Replace() 函数格式——提取](../custom.md#replace-函数)，传入卡片中的摘录。
:::

由于大部分情况下只是为了添加评论，而无须提取，所以你可以直接输入评论内容。
