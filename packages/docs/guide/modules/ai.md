<script setup>
import AIShortcut from '/.vitepress/components/AIShortcut.vue';
</script>
# AI

::: warning Powered by [OpenAI](https://openai.com/)

使用本模块，请准备好网络以及 [OpenAI API Key](https://platform.openai.com/account/api-keys)。OpenAI API 不支持中国大陆以及中国香港访问。

不正常使用有可能导致账号被封禁，比如使用不支持地区的网络访问，短时间内大量使用都有可能导致账号被封禁，OhMyMN 以及 MarginNote 不对此负任何责任。

OhMyMN 完全开源，不会上传数据，如果遇到 API Key 被盗用，请检查自身原因，及时重置 Key。
:::

::: tip 更新
[v4.2.0](/update.md) 新增
:::

为 OhMyMN 提供 AI 能力。由于 OpenAI API 速度太慢，极大降低了摘录速度，违背了 OhMyMN 的初衷，所以我不会提供任何自动执行的 AI 模块。但是你可以自行编写 Prompt 手动执行。你也可以自己开发 [新的模块](../../dev/module/how.md)，比如 AI 翻译。可以查看 [AIAssistant](https://bbs.marginnote.com.cn/t/topic/41660)。

## OpenAI API 服务器地址

::: tip 默认
api.openai.com
:::

网络上有不少代理 OpenAI API 服务器，可以在国内使用。但安全性未知，不建议使用。

## OpenAI 模型

::: tip 更新
[v4.4.0](/update.md) 只支持 gpt-3.5-turbo 和 gpt-4-turbo。
:::

- `gpt-3.5`: 即 gpt-3.5-turbo 速度较快。
- `gpt-4`: 即 gpt-4-turbo 速度较慢，但更聪明。

::: tip token
OpenAI API 有输入+输出长度限制，也就是 Max Tokens，而且不光包括输入，还包括输出。比如 Max Tokens 为 4k，输入 2k，输出只能 2k。

一般一个汉字占 2 个 token，一个英文单词占 1 个 token。
:::

## 思维发散程度
也就是 Temperature 参数，0-2，越高越发散，越低越收敛。

如果需要准确答案，建议调低。如果需要创造性答案，比如写一篇小说，可以适当调高，但不应该大于 1。

## Prompts 数据源

需要填入一张卡片的链接，比如 `marginnote3app://note/BF594D1D-AC4E-46DC-8F13-87B7018E414D`。
::: warning 注意
序号为自动生成。每次修改需要重新在这里回车确认，更新数据。更新后，序号会重新生成。请不要调整卡片顺序。
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/202305062309477.png?x-oss-process=base_webp)

你只需要按照这个格式在子卡片中填写 Prompt 即可，好的 Prompt 可以让 OpenAI 无所不能。

- 标题：作为 Prompt 的描述信息，选择 Prompts 的时候会显示。
- 第一条评论：注意是评论，作为 Prompt。
- 第二条评论: 参数。
  - `io`: 输入输出，`title2comment` 表示将标题作为输入，拼接到 Prompt 后面，得到的结果作为评论。其他同理，excerpt 表示摘录，card 表示卡片里所有的摘录和评论。可以写多个，用 `,` 隔开。比如 `io: title2comment,excerpt2comment`。如果不填写，会在使用时手动选择。
    - `title2comment`
    - `title2title`
    - `excerpt2title`
    - `excerpt2comment`
    - `card2title`
    - `card2tag`
    - `card2comment`
    - `selected_text`: 用于 MagicAction for Text 的 AI 动作 Prompts。
  - `model`: 模型，在这里可以设置不同的 Prompt 使用不同的模型。降低成本。
    - `gpt-3.5`
    - `gpt-3.5-16k`
    - `gpt-4`
    - `gpt-4-32k`
  - `temperature`: 也就是前面提到的思维发散程度。可以根据 Prompt 填写。
  - `max_tokens`: 注意，这是回答的 max_tokens，和前面说的不一样。填小一点可以让回答更快，但是可能会不完整。

### 如何快速触发特定 Prompt

目前只能通过 [Shortcut](./shortcut.md#自定义捷径) 模块的自定义捷径功能。启用 Shortcut 模块，打开自定义捷径。

在下方输入 Prompt 前的序号，序号为自动生成。

::: warning 捷径生成器
<AIShortcut/>
:::

用 Raycast 或者其他快捷键设置工具，设置快捷键打开链接即可。在 iPad 上通过手势也可以打开链接。

### Prompts 推荐
Prompt 推荐用英文写，AI 更容易理解。可以借鉴 [Ask Prompts](https://www.askprompts.com/)、[Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) 和 [ChatGPT 中文调教指南](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)。

1. 补全词形。用来替代 AutoComplete。并且支持更多词形，以及更多语言，自行调整即可。

::: code-group
```txt [Prompt]
Complete the word forms of this word. If the given form is not the base form, output all forms of the base form. Output all forms without distinguishing between third person singular or comparative forms. Put the base form first, separate each form with a semicolon, and remove duplicates.

```
```txt [Option]
max-tokens: 20
temperature: 0
io: title2title
```
:::

2. 英译中。
::: code-group
```txt [Prompt]
You are a professional translation engine, please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation. You must only translate the text content, never interpret it。Translate from English to Simple Chinese. Only the translated text can be returned。
```
```txt [Option]
temperature: 0
```
:::
3. 单词模式，可以更详细的翻译结果，包括：音标、词性、含义、双语示例。

::: code-group
```txt [Prompt]
你是一个翻译引擎，请将翻译给到的文本，只需要翻译不需要解释。当且仅当文本只有一个单词时，请给出单词原始形态（如果有）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句，请严格按照下面格式给到翻译结果：
                [<语种>] · / <单词音标>
                [<词性缩写>] <中文含义>]
                例句：
                <序号><例句>(例句翻译)
```
```txt [Option]
temperature: 0
io: title2comment
```
:::

4. 查询中文词组，展示多种翻译结果，并阐述适用语境。

::: code-group
```txt [Prompt]
你是一个翻译引擎，请将给到的文本翻译成 English。请列出3种（如果有）最常用翻译结果：单词或短语，并列出对应的适用语境（用中文阐述）、音标、词性、双语示例。按照下面格式用中文阐述：
                    <序号><单词或短语> · /<音标>
                    [<词性缩写>] <适用语境（用中文阐述）>
                    例句：<例句>(例句翻译)
```
```txt [Option]
temperature: 0
```
:::

## [MagicAction for Card](magicaction4card.md#ai-动作)

### 基于卡片回答

基于卡片内容回答问题并生成评论，你可以用自然语言指定标题，摘录，评论以及标签。

### AI 动作 (Prompts)

读取 Prompts 数据源，选择 Prompt 执行。

## [MagicAction for Text](magicaction4text.md#ai-动作-prompts)

### AI 动作 (Prompts)

读取 Prompts 数据源，选择 Prompt 执行。