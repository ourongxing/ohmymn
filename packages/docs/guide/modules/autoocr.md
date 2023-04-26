# AutoOCR
AutoOCR 的本职工作是进行小语种的在线矫正，在摘录时自动执行。公式识别只能在 MagicAction for Text 手动调用，无法摘录时自动识别。
## 获取 API 密钥
和 AutoTranslate 一样，AutoOCR 也是使用的第三方服务，需要你自行获取密钥。
### 百度 OCR

::: warning 注意
自行搜索 [如何申请百度 OCR API](https://cn.bing.com/search?q=如何申请百度+OCR+API)，具体价格和额度以官网为准，所产生的任何费用与 OhMyMN 无关。
:::

AutoOCR 采用高精度版本，免费额度较低。额度用完会自动停止服务。

### MathPix

::: warning 注意
自行搜索 [如何申请 MathPix API](https://cn.bing.com/search?q=如何申请+MathPix+API)，具体价格和额度以官网为准，所产生的任何费用与 OhMyMN 无关。
:::

MathPix 仅用于公式识别，其准确度比百度要高。 需要注意的是，MathPix 价格经常变化，并且价格不菲。

## 小语种在线矫正

::: warning 注意
`摘录时自动执行` 和 `识别语言` 均为当前文档有效，这样可以为不同的文档单独设置。
:::

MarginNote 的 OCR Pro 不支持很多小语种，导致无法正常摘录，~~比如俄语~~（现在已经支持）。Auto OCR 利用百度的 OCR 服务来重新进行在线矫正。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20220813094209.gif?x-oss-process=base_webp)

搭配上 AutoTranslate 还可以实现小语种的自动翻译。
## [MagicAction for Text](magicaction4text.md#公式识别)


### 公式识别
::: warning 注意
公式识别只能在 MagicAction for Text 手动调用，无法摘录时自动识别。不要框选超过两行的文字，容易失败，并且在卡片中显示不完整。
:::


需要利用 Markdown 插件来显示公式，所以你必须提前安装好 Markdown 插件。目前有三款 Markdown 插件，推荐使用 [Milkdown](https://bbs.marginnote.cn/t/topic/34772)。

该功能有三个选项
- `pure latex`: [MarkDown](https://bbs.marginnote.cn/t/topic/7280/124) 插件请选择该选项，包括 Milkdown 开启兼容 MarkDown 后也需要选择该选项。请注意 Milkdown 和 MarkDown 这两个插件在公式这方面语法不相同，请认真思考后再选择是否兼容。
- `$$latex$$` `$latex$`: [myMarkdown](https://bbs.marginnote.cn/t/topic/13635) 和 [Milkdown](https://bbs.marginnote.cn/t/topic/34772) 都可以选择，至于区别自行了解。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/b408c73d8abd1f90bd9580eadd9dbeeb9c9d3701.gif?x-oss-process=base_webp)

请做好心理准备，虽然看上去很爽，但实现起来很复杂：
1. 申请百度 OCR 或者 MathPix 的 API 密钥。
2. 填入 AutoOCR 中，并且选择对应的公式识别服务商。
3. 安装任意一款 Markdown 插件，并且选择对应的 Markdown 插件。
4. MagicAction for Text —— 弹出更多选项，开启 `添加为评论`。
5. **先选中一条摘录或者卡片**（否则只能将结果复制到剪贴板上），再框选，再点击 `公式识别`，识别好的公式 Latex 会自动写入之前选中的卡片中。使用 Gesture 模块来调用执行体验更佳。

### 文字识别

对选中的文字或者区域进行文字识别，并将结果复制到剪贴板上。
### 手写识别

使用百度 OCR 服务来进行手写识别，注意免费额度。
### 二维码识别

使用百度 OCR 服务来进行二维码识别，注意免费额度。
