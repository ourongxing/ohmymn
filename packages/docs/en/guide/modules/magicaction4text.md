# MagicAction for Text

The actions here are related to the selected text, which mostly just copy the result to the clipboard. After selecting the text, click the button to search or copy the selected text. Not only text, but also a selected area can be used, even for formula OCR.

## Pre OCR

::: tip Only Current Document
The module needs to be enabled, but does not need to be turned on `Auto Run When Excerpting`.
:::

Use [AutoOCR](autoocr.md) for foreign language text recognition, thus facilitating the subsequent copying, searching, and translation operations.

## Pre Format

::: tip Only Current Document
The module needs to be enabled, but does not need to be turned on `Auto Run When Excerpting`.
:::

Use [AutoFormat](./autoformat.md) to format selected text.

## Pre Simplify

::: tip Only Current Document
The module needs to be enabled, but does not need to be turned on `Auto Run When Excerpting`.
:::

Use [AutoSimplify](autosimplify.md) to convert to Simplified Chinese.

## Popup More  Options

I do not know if you have noticed, when you select a piece of excerpt in the document, followed by the hand tool to select a paragraph of text, the menu will display `Set Title` , `Add as Comment`, and other options. This will allow you to select the text directly as the title or comments added to the previously selected excerpt.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/ebffda8ba4d486a3d3.gif?x-oss-process=base_webp)

OhMyMN takes advantage of this feature. When you select a piece of excerpt in a document, immediately use the hand tool to select a piece of text, and then execute the action, certain actions that copy the result of the execution to the clipboard will pop up more options, such as "set title", “merge title”, and “add as comment”, etc.

## Action

### Copy Selected Text
This action may seem useless, but when you use it with `Popup More Options`, you will know how useful it is.
### Search Selected Text

From [CopySearch](copysearch.md)

### Formula Recognition

From [AutoOCR](autoocr.md#formula-recognition)

### Text Recognition

From [AutoOCR](autoocr.md#text-recognition)

### Handwriting Recognition

From [AutoOCR](autoocr.md#handwriting-recognition)

### QR Code Recognition

From [AutoOCR](autoocr.md#qr-code-recognition)

### Translate Selected Text

From [AutoTranslate](autotranslate.md#translate-selected-text)

### Convert to Simplified Chinese

From [AutoSimplify](autosimplify.md)