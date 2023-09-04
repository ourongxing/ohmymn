# 简介

::: tip 模块
可以类比插件，是 OhMyMN 内部的插件。
:::

首先要明白 OhMyMN 本质上是一个工具箱。里面所有的功能都是单独的模块，每个模块都被赋予了三种能力：

1. 摘录时，修改摘录的内容或者获取摘录内容并进行其他操作。
2. 脑图中选中卡片后，对卡片进行修改或获取信息并进行其他操作。
3. 文档中选中文字后，获取文字或选区信息并进行其他操作。

有的模块可能三种能力都用了，有的可能只用了其中一个，也有的一个都没有，仅仅只是一些选项。

使用第一种能力的模块通常以 Auto 开头，比如 AutoTitle，AutoDef，表示可以在摘录时自动执行（默认不执行，需要开启 `摘录时自动执行`）。使用第一种能力的模块通常还会使用第二种能力，以便处理已经存在的卡片。

第二种能力和第三种能力也通常同时使用，比如用来复制，搜索，导出。它们有一个共同的名字 —— 动作（Action）。所有模块的动作都会出现在 [MagicAction for Card](modules/magicaction4card.md) 和 [MagicAction for Text](modules/magicaction4text.md) 中，也就是一个按钮，点击就会执行相应的动作。

除此之外，所有模块被分为了两大类：

1. 必选模块：无法关闭的模块。

   - [OhMyMN](./modules/ohmymn)
   - [MagicAction for Card](./modules/magicaction4card)：一些与卡片有关的动作
   - [MagicAction for Text](./modules/magicaction4text)：一些与文本有关的动作

2. 可选模块：可以选择开启的模块，可以在 `OhMyMN-模块快捷开关` 中启用

   - [Shortcut](./modules/shortcut)：使用 URL Scheme 触发动作，可自行设置快捷键来打开 URL Scheme。
   - [Gesture](./modules/gesture)：使用手势触发动作。
   - [Toolbar](./modules/toolbar)：在点击卡片或者选择文字时添加动作工具栏。
   - [CopySearch](./modules/copysearch)：复制或搜索选中的文字或选中的卡片。
   - [AI](./modules/ai.md): AI 动作，自定义 Prompts。
   - AutoX
     - [Another AutoTitle](./modules/anotherautotitle)：自动转标题。
     - [Another AutoDef](./modules/anotherautodef)：自动拆分摘录为标题和摘录两部分，提取标题。
     - [AutoFormat](./modules/autoformat)：自动格式化摘录，比如自动添加空格。
     - [AutoComplete](./modules/autocomplete)：自动补全英文单词词形，填充单词信息，制成单词卡片。
     - [AutoReplace](./modules/autoreplace)：自动替换摘录中的内容。
     - [AutoList](./modules/autolist)：自动在指定位置换行，添加序号。
     - [AutoTag](./modules/autotag)：自动添加标签或者提取部分内容为标签。
     - [AutoComment](./modules/autocomment)：自动添加评论或者提取部分内容为评论。
     - [AutoStyle](./modules/autostyle)：自动设置摘录颜色和填充样式。
     - [AutoOCR](./modules/autoocr)：自动对摘录的选区进行 OCR 识别或者矫正。
     - [AutoTranslate](./modules/autotranslate)：自动翻译摘录的内容。
     - [AutoSimplify](./modules/autosimplify)：自动将繁体转为简体中文。
   - ~~Export to X~~
     - ~~Export to Flomo~~
     - ~~Export to Anki~~
     - ~~Export to Devonthink~~
