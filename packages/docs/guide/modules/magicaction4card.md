# MagicAction for Card

一些与卡片相关的动作，其实就是按钮，先选中卡片（可以多选），再点击按钮来手动执行。部分动作来自于其他模块，需要启用后对应模块后才会显示动作，这些动作和模块相绑定，使用相同的配置，模块启用后才会在此显示相应动作。

## 智能选择

当你选中一个有子节点的卡片或者选中多个同层级并且均有子节点的卡片，此时 OhMyMN 会弹出菜单，询问是否选中子节点或者后代节点，这可以用于快速批量选中。

父子节点的 [相关概念](../concept.md#2-卡片节点父子卡片父子节点祖先卡片祖先节点后代卡片后代节点)

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220521005122.png?x-oss-process=base_webp)

## 动作

### 配置管理

::: tip 更新
[v4.0.6](/update.md) 新增：支持导出或导入单个模块的配置。支持手动重置配置和同步多窗口的配置。
:::

::: warning 注意
请先认真阅读 OhMyMN 的 [配置结构](../profile.md#配置结构) 。
:::

1. 写入配置：将配置写入选中卡片的子卡片中。请确保选中卡片有子卡片，子卡片越多越好，因为这个配置信息会不断膨胀，避免超过一张卡片的最大字数。
   - 所有配置
   - 全局配置 12345：全局配置还可以继续单独导出某一模块的配置。
   - 文档配置
   - 笔记本配置
2. 读取配置：读取卡片中的配置。可以只读取某一模块的配置，并写入到指定的全局配置中。
   - 所有配置 -> 全局配置 -> 模块配置
3. 重置配置：重置为默认配置。
4. 同步多窗口的配置：OhMyMN 在多窗口的情况下修改配置不会立刻同步过去，你可以该选项来强制同步。

### 筛选卡片

::: warning 输入格式
[正则表达式——匹配](../custom.md#正则表达式)
:::

可以单独筛选标题，摘录，评论，标签。筛选后还可以继续使用其他动作。

虽然 OhMyMN 的选中和 MarginNote 的选中不一样，无法使用删除，剪切的功能。不过办法总是有的，你可以把选中的卡片添加一个特殊的标签，再通过标签筛选，即可快速重新选中。最后再统一删除这个标签即可。

同样，OhMyMN 无法通过颜色筛选，你可以使用 MarginNote 筛选后添加特殊的标签，再通过 OhMyMN 筛选并处理。最后再统一删除这个标签即可。

### 合并卡片

MarginNote 自带的合并功能实在鸡肋，不但无法合并标题，还会把标题作为评论合并进卡片。该功能解决了三个问题：

1. 合并标题。
2. 其它卡片标题不作为评论。
3. 合并标签。

### 重命名标题

OhMyMN 中最强大的功能前三吧，用于批量对卡片重命名，编号，分层编号。

::: warning 输入格式
[Replace() 函数格式——替换](../custom.md#replace-函数)
:::

由于大多数情况下是匹配整个标题，所以默认的正则就是 `/^.*$/`，你只需要输入新的标题即可，还可以用 `$&` 来引用当前标题。

#### 1. 编号

::: warning 输入
`%["1"] $&`
:::

这里用到了一个魔法变量，`%["1"]`，每次调用时都会递增,请自行查看 [语法](../serial.md#1-和-1)。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/f85817a79fcba635afa7eb0de63d34f0ffbb9b48.gif?x-oss-process=base_webp)

#### 2. 分层编号

::: warning 输入

`#["1"] $&`

分层编号是对其所有后代节点进行编号，自身不会编号。使用时请确保该卡片有子节点。
:::

`#["1"]` 也是一个魔法变量，请自行查看[语法](../serial.md#1)。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/e8ae47a8999bb30794c70aba1b3c24da143f25cd.gif?x-oss-process=base_webp)

#### 3. 将标签作为标题

::: v-pre

::: warning 输入

`{{tags}}`

:::

这里用到的是模版，自行查看 [模版语法](../mustache.md) 以及 [模版变量](../vars.md)。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/f7ab0467646ca7b94a4ea9a560c016c9543.gif?x-oss-process=base_webp)

### 合并卡片内文字

::: tip 更新
[v4.0.6](/update.md) 改进：摘录的图片不会自动 OCR 合并。
:::

只会合并文字摘录和文字评论，图片以及 HTML 评论（Markdown）会自动置顶。标签和链接会自动置底。

你可以在这里设置前后修饰，比如开头加上编号，结尾加上换行。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220730161836.png?x-oss-process=base_webp)

默认为 `%["1"]. $&\n\n`

- `%["1"]` 前面提过，会自动递增的魔法变量，详细用法请查看[语法](../serial.md#1-和-1)。
- `$&` 表示当前的评论或者摘录。
- `\n` 表示换行，这个到处都会用到，在 OhMyMN 里想要换行，就使用 `\n`。

如果你想直接合并两段文字，不留空隙，输入 `$&` 即可。

**选项：**

- 合并为摘录：摘录可以使用 MagicAction 中的其他功能进行进一步操作，同时会保留重点。
- 合并为评论。

### 切换摘录标题

- 切换为不存在的
::: tip 更新
[v4.0.11](/update.md) 新增更多交换方式
:::
- 交换标题和摘录：标题或摘录只有一个存在的情况下，和 `切换为不存在的` 一样。在标题和摘录都有的情况下，会有以下处理方式：
   -  摘录 → 标题
   -  摘录 ← 标题
   -  摘录 ⇄ 标题

### 提取标题

来自于 [Another AutoDef](anotherautodef.md#提取标题)

### 拆分摘录

::: tip 更新
[v4.0.6](/update.md) 新增
:::

来自于 [Another AutoDef](anotherautodef.md#拆分摘录)

### 优化摘录排版

来自于 [AutoFormat](autoformat.md#优化摘录排版)

### 英文单词制卡

来自于 [AutoComplete](autocomplete.md#英文单词制卡)

### 替换摘录文字

来自于 [AutoReplace](autoreplace.md#替换摘录文字)

### 添加换行或序号

来自于 [AutoList](autolist.md#添加换行或序号)

### 修改摘录颜色

来自于 [AutoStyle](autostyle.md#修改摘录颜色)

### 修改摘录样式

来自于 [AutoStyle](autostyle.md#修改摘录样式)

### 搜索卡片内容

来自于 [CopySearch](copysearch.md)

### 复制卡片内容

来自于 [CopySearch](copysearch.md)

### 添加标签

来自于 [AutoTag](autotag.md#添加标签)

### 翻译摘录内容

::: tip 更新
[v4.0.16](/update.md) 新增
:::

来自于 [AutoTranslate](autotranslate.md#翻译摘录内容)
### 添加评论

来自于 [AutoComment](autocomment.md#添加评论)

### 转换为简体中文

::: tip 更新
[v4.0.6](/update.md) 新增
:::

来自于 [AutoSimplify](autosimplify.md#转换为简体中文)


### 基于卡片回答
::: tip 更新
[v4.2.1](/update.md) 新增
:::

来自于 [AI](ai.md)
### AI 动作 (Prompts)
::: tip 更新
[v4.2.0](/update.md) 新增
:::

来自于 [AI](ai.md)