# AutoOCR
AutoOCR 的本职工作是进行小语种的在线矫正，在摘录时自动执行。公式识别只能在 MagicAction for Text 手动调用，无法摘录时自动识别。

::: tip 更新
[v4.4.2](/update.md) 支持 Doc2X 和 SimpleTex 用于公式识别。
:::

## 获取 API 密钥
和 AutoTranslate 一样，AutoOCR 也是使用的第三方服务，需要你自行获取密钥。

### 百度 OCR

::: warning 注意
自行搜索「如何申请百度 OCR API」，参考教程 [百度文字识别API Key和Secret Key申请及接口调用](https://www.cnblogs.com/gezp/p/13673229.html)，具体价格和额度以官网为准，所产生的任何费用与 OhMyMN 无关。
:::

AutoOCR 采用高精度版本，免费额度较低。额度用完会自动停止服务。

### Doc2X

::: warning 注意
Doc2X 官网：[https://doc2x.com/](https://doc2x.com/)，个人信息里的身份令牌就是 API 密钥。具体价格和额度以官网为准，目前免费，所产生的任何费用与 OhMyMN 无关。
:::

Doc2X 对于多行公式以及文本和公式混合的识别效果非常好，甚至可以识别成 Markdown，推荐。


### SimpleTex

::: warning 注意
参考教程 [SimpleTex 免费API申请方法](https://getquicker.net/Common/Topics/ViewTopic/24510)。具体价格和额度以官网为准，目前免费，所产生的任何费用与 OhMyMN 无关。
:::

SimpleTex 对于一行公式的效果比较好，如果是多行就不太行了。


### MathPix（不推荐）

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

需要利用 Markdown 插件来显示公式，所以你必须提前安装好 Markdown 插件。目前有三款 Markdown 插件，推荐使用 [Milkdown](https://bbs.marginnote.cn/t/topic/34772)。MarginNote 4 中默认启用自带 Markdown。

该功能有三个选项
- `pure latex`: [MarkDown](https://bbs.marginnote.cn/t/topic/7280/124) 插件请选择该选项，包括 Milkdown 开启兼容 MarkDown 后也需要选择该选项。请注意 Milkdown 和 MarkDown 这两个插件在公式这方面语法不相同，请认真思考后再选择是否兼容。对于 Doc2X 识别的公式，建议选择该选项，Doc2X 会自动添加 `$`。
- `$$latex$$` `$latex$`: [myMarkdown](https://bbs.marginnote.cn/t/topic/13635) 和 [Milkdown](https://bbs.marginnote.cn/t/topic/34772) 都可以选择，至于区别自行了解。

**演示**(MN4)
- 常规操作
![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20240520174628_rec_.gif?x-oss-process=base_webp)
- 进阶操作
![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20240520174754_rec_.gif?x-oss-process=base_webp)
### 文字识别

对选中的文字或者区域进行文字识别，并将结果复制到剪贴板上。

::: tip
由于 Doc2X 的识别效果非常好，对于普通文本也可以很高的识别率，所以直接使用「公式识别」也能达到同样的效果。
:::

### 手写识别

使用百度 OCR 服务来进行手写识别，注意免费额度。

::: tip
由于 Doc2X 的识别效果非常好，对于普通文本也可以很高的识别率，所以直接使用「公式识别」也能达到同样的效果。
:::

### 二维码识别

使用百度 OCR 服务来进行二维码识别，注意免费额度。