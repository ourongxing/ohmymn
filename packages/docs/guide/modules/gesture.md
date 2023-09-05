# Gesture

::: warning 注意
仅 iPad 可用。该功能完全由 OhMyMN 提供，与 MarginNote 无关。
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/79b47e3272bf5eee9be5c5c9737ead591d312917.gif?x-oss-process=base_webp)

使用手势来触发 MagicAction 中的动作。

::: tip
尽量在中间区域滑动，滑动速度慢且距离长。
:::

通过在不同工具栏上 `上下左右` 滑动来直接触发 MagicAction 上的动作，而不用打开控制面板，一步到位。


## 自定义捷径
::: tip 更新
[v4.0.14](/update.md) 新增。现在你可以用手势触发自定义捷径。你必须启用 [Shortcut](shortcut.md) 模块，并打开 [自定义捷径](./shortcut.md#自定义捷径) 的开关。
:::

::: tip
为了让其具有更高的可操作性，我只是简单的打开这个 URL，而没有将其限定在 OhMyMN 中。这意味着你可以用手势触发其他插件中的捷径。以后捷径会成为每个插件的标配功能。
:::
## 手势识别区域


### 卡片相关工具栏

目前有三个区域四个方向的手势，两个区域是卡片相关，用于触发 [MagicAction for Card](magicaction4card.md) 上的动作。

`卡片选择工具栏`

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101445.png?x-oss-process=base_webp)

`卡片多选工具栏`

::: warning 注意
如果只选中单张卡片，但手动开启了多选工具栏，此次多选工具栏的手势不会响应。
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101505.png?x-oss-process=base_webp)


### 文字选择工具栏

这个区域是文字选择相关，一般是用手指或者手型工具选择文字时会出现，用于触发 [MagicAction for Text](magicaction4text.md) 上的动作。框选一个区域也是一样的。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101552.png?x-oss-process=base_webp)

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101619.png?x-oss-process=base_webp)


这两个的菜单样式有所不同，但都属于文字选择工具栏。第一个会出现 `设置标题` `加为评论` 等选项，这是因为在选中这段文字之前，你已经选中了一段摘录的笔记。

[MagicAction for Text](magicaction4text.md) 已经对此进行特别处理，具体可以自行查看，可以实现了公式 OCR 后直接添加到卡片中。

### 调整文字选择工具栏识别区域
::: tip 更新
[v4.3.2](/update.md) 移除。如果文字选择工具栏始终无法响应手势，大概率是因为那压根就不是文字选择工具栏，而是已经摘录的笔记的工具栏。
:::

## 手势屏蔽区域

其实这个手势检测是加在了整个 MarginNote 界面上，理论上在任何地方滑动，OhMyMN 都会接收到信息。只是我做了屏蔽，使其只在指定几个区域上做出反应。

但是这几个工具栏位置的判断并没有那么准确，所以可能会导致没有在工具栏上滑动，OhMyMN 却执行了动作。为了减少这种情况发生，我进一步限制了识别的区域，尤其是 `卡片单选工具栏`，限制最大。

如图所示，如果 `卡片单选工具栏` 出现在红框内，并在红框区域内滑动，均不会响应。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731113055.png?x-oss-process=base_webp)

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731113307.png?x-oss-process=base_webp)
