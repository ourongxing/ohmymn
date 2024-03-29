# AutoComplete

**Powered by [ECDICT](https://github.com/skywind3000/ECDICT) & [API](http://dict.e.opac.vip/dict.php)**
::: warning
This module will use an online API to get data, which requires internet connection and may not work properly for foreign users because the server is in China. The API is currently free to use, but it is not guaranteed to be valid for a long time. v4 version provides a local database version, you can choose to download and open it yourself, available in Github Release. The database is large, the first installation will decompress the database, please wait patiently.
:::

This feature is used to solve one of the issues of using MarginNote to learn English and extract English words. In an English article, words are often not in basic forms and thus cannot make good use of the title links. When you turn on the AutoComplete feature, it will automatically complete the third-person singular form, plural form, past tense, perfect tense, comparative form, and other forms.

What's even more powerful is that the feature can automatically determine whether your excerpt is in the basic form or not, and then complete all forms.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/f5ed247b373a2f5f053b6f3523.gif?x-oss-process=base_webp)

## Collins Star Filtering

The more commonly used the word is in the Collins dictionary, the higher the star rating. There are 6 levels from 0 to 5 stars. Usually, words with 5 stars are relatively simple words and can be filtered.

## Fill in Word Information

It is possible to add some information about the words as comments to create cards automatically.

### Custom

::: warning Custom Format
[Template](../custom.md#template)
:::

There are the following variables
::: v-pre
| Variable   | Comments                                                |
|------------|---------------------------------------------------------|
| `word`     | the basic form of the excerpted word                    |
| `phonetic` | phonetic symbols (mostly in British IPA)                |
| `zh`       | Chinese interpretation                                  |
| `en`       | English interpretation                                  |
| `tags`     | tags such as college entrance exams, CET 4, CET 6, etc. |
| `collins`  | word frequency according to Collins Dictionary          |

There are two input fields, which can generate two comments. Usually, the first field is filled with information such as phonetic symbols, labels, etc., and the second field is filled with the interpretation in Chinese or English. This makes it easy to put the comments on the back of the card separately in the Review Mode.

Default Placeholder 1: `{{#phonetic}}🔈[{{phonetic}}] {{/phonetic}} {{collins}}{{#tags}}\n🏷 {{tags}}{{/tags}}`

Default Placeholder 2: `✍🏻\n{{zh}}\n👀`
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220730234119.png?x-oss-process=base_webp)

## Dynamic Interpretation Selection

When this option is turned on, a pop-up window will appear during the excerpt to select the meaning in the current text (up to 9). If you are not satisfied with the results, you can enter a custom one in the input box.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731000657.png?x-oss-process=base_webp)

### Multi-select Interpretation

Multi-select the interpretation by entering the specified variable in the input box.

- `[all]`: All interpretations.
- `[1-9]`: Interpretations #1-9.
- `[123789]`：Interpretations #1, 2, 3, 7, 8, 9, and so on.
- `[adj]`: The interpretation of adjectives, and so on.

Multi-select Interpretation and Custom Interpretation can be used simultaneously, such as `[all] v. new interpretation`。

## Dynamic Basic Form Selection

Some words, such as "lay", are both the past tense of "lie" and the basic form of "laid". This is where you need to make a choice.

## Auto Excerpt Context

::: tip
If you use [AutoTranslate](autotranslate.md), the excerpt text will be translated automatically.
:::

As the name suggests, it can automatically extract the sentence in which the current word is located, thus preserving the context and making it easy to review and memorize.

OCR Pro is not currently supported, and will not work if the PDF itself does not have a text layer. If you rely heavily on this feature, you can use Abbyy to OCR the entire book.

## [MagicAction for Card](magicaction4card.md#generate-word-card)

### Generate Word Card

::: tip
When you selected more than one card, the `Dynamic Basic Form Selection` and `Dynamic Basic Form Selection` will be turn off automatically.
:::

Using the same settings, the information generated by AutoComplete belongs to comments, which cannot be modified and can only be deleted and re-added.

- Append: add new comments
- Replace: First delete the old comment, and then add the new comment (Images may be moved to the top)
