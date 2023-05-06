# MagicAction for Text

这里的动作和选中文字有关，大部分只是将结果复制到剪贴板上。所有动作都来自于各个模块，需要启用后对应模块后才会显示动作。在选中文字后，点击按钮来对选中的文字进行搜索或者复制。不止文字，框选一块区域也可以，甚至可以用来进行公式 OCR。

## 预先 OCR

::: warning 仅当前文档
需要启用 AutoOCR 模块，但不需要打开 `摘录时自动执行`。
:::

使用 [AutoOCR](autoocr.md) 来进行小语种的文字识别，从而方便后续的复制，搜索，以及翻译操作。

## 预先转为简体中文

::: warning 仅当前文档
需要启用 AutoSimplify 模块，但不需要打开 `摘录时自动执行`。
:::

使用 [AutoSimplify](autosimplify.md) 进行繁简转换。

## 预先格式化

::: warning 仅当前文档
需要启用 AutoFormat 模块，但不需要打开 `摘录时自动执行`。
:::

::: tip 更新
[v4.0.6](/update.md) 新增
:::

使用 [AutoFormat](./autoformat.md) 进行排版优化。

## 弹出更多选项

不知道你发现了没有，当你在文档中选中了一块摘录后，紧接着再用手型工具去选中一段文字，菜单里就会出现 `设置标题` `加为评论` 等选项。这样就可以直接把你选中的这段文字直接作为标题或者评论加到之前选中的摘录里。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/ebffda8ba4d486a3d3.gif?x-oss-process=base_webp)

OhMyMN 利用了这一特性。当你在文档中选中了一块摘录后，紧接着再用手型工具去选中一段文字，此时再执行动作，某些会将执行结果复制到剪贴板的动作就会弹出更多选项，比如设置标题，合并标题，设为评论等。
::: tip
这里的动作指的是 OhMyMN 里的动作，也就是👇这些动作。
:::
## 动作

### 复制选中文字

::: tip 更新
[v4.0.6](/update.md) 新增，[v4.1.0](/update.md) 修改，不再属于 CopySearch。
:::

这个动作看似没用，但当你搭配 `弹出更多选项` 时，就知道有多好用了。

### 搜索选中文字

来自于 [CopySearch](copysearch.md)

### 公式识别

来自于 [AutoOCR](autoocr.md)

### 文字识别

来自于 [AutoOCR](autoocr.md)

### 手写识别

来自于 [AutoOCR](autoocr.md)

### 二维码识别

来自于 [AutoOCR](autoocr.md)

### 翻译选中文字

来自于 [AutoTranslate](autotranslate.md)

### 转为简体中文

::: tip 更新
[v4.0.6](/update.md) 新增
:::

来自于 [AutoSimplify](autosimplify.md)

### AI 动作 (Prompts)
::: tip 更新
[v4.2.0](/update.md) 新增
:::

来自于 [AI](ai.md)