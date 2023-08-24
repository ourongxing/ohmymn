# Template Variable

If you have already learned [Template Syntax](mustache), then you can use the following variables at your leisure.

::: tip
`Metadata` addon could import data from Zotero. You can use the data in template. Not yet officially released, you can test it from [Github](https://github.com/ourongxing/metadata/releases).
:::
## Variables

### MindMap Cards

| Variables Name <div style="width:140px"/> | Type         | Description                                                                                   |
| ----------------------------------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `id`                                      | String       | Note ID                                                                                       |
| `url.pure`                                | String       | Note URL                                                                                      |
| `url.md`                                  | String       | Note URL，add `[]()`                                                                          |
| `url.html`                                | String       | Note URL，add `<a>`                                                                           |
| `page.start`                              | String       | Start page of notes in the document                                                           |
| `page.end`                                | String       | End page of notes in the document                                                             |
| `page.real.start`                         | String       | `Metadata Required` Calculate the start page number after the offset.                         |
| `page.real.end`                           | String       | `Metadata Required` Calculate the end page number after the offset.                           |
| `time.creat`                              | String       | Note created time                                                                             |
| `time.modify`                             | String       | Note Modified Time                                                                            |
| `time.now`                                | String       | Now                                                                                           |
| `allTextPic.text`                         | String       | All text in the card, including the text in the Markdown addon.                               |
| `allTextPic.ocr`                          | String       | All text in the card, picture excerpts will be automatically OCR, excluding picture comments. |
| `allTextPic.md`                           | String       | All text and images in the card. Images are encoded in base64 and add `![]()`                 |
| `allTextPic.html`                         | String       | All text and images in the card. Images are encoded in base64 and add `<img src>`             |
| `tags`                                    | String Array | All tags, no #                                                                                |
| `titles`                                  | String Array | All titles                                                                                    |
| `excerpts.text`                           | String Array | All text excerpt                                                                              |
| `excerpts.ocr`                            | String Array | All excerpts. Image excerpts are OCR'd as text                                                |
| `excerpts.html`                           | String Array | All excerpts. Image excerpts are OCR'd as text, and add `<img>`                               |
| `excerpts.md`                             | String Array | All excerpts. Image excerpts are OCR'd as text, and add `![]()`                               |
| `comments.text`                           | String Array | All text comments. Includes text from Markdown addon                                          |
| `comments.html`                           | String Array | All comments. Images are encoded in base64 and add  `<img>`                                   |
| `comments.md`                             | String Array | All comments. Images are encoded in base64 and add `![]()`                                    |

### Document

The document to which the current card belongs

| Variables Name <div style="width:80px"/> | Type   | Description                                                                                                                |
| ---------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `doc.title`                              | String | Document title                                                                                                             |
| `doc.md5`                                | String | Document md5                                                                                                               |
| `doc.path`                               | String | Document path                                                                                                              |
| `doc.url.pure`                           | String | `Only in Notebook` Document URL, which jumps indirectly through the link of the last note in the document in the notebook. |
| `doc.url.md`                             | String | `Only in Notebook` Document URL, add `[]()`                                                                                |
| `doc.url.html`                           | String | `Only in Notebook` Document URL, add `<a>`                                                                                 |
| `doc.reference`                          | String | `Metadata Required` Reference or Citation                                                                                  |
| `doc.citeKey`                            | String | `Metadata Required` Citation key                                                                                           |
| `doc.pageOffset`                         | String | `Metadata Required` Page offset                                                                                            |
| `doc.metadata`                           | Object | `Metadata Required` All metadata imported from Zotero                                                                      |

### Notebook

The notebook to which the current card belongs

| Variables Name <div style="width:150px"/> | Type   | Description               |
| ----------------------------------------- | ------ | ------------------------- |
| `notebook.title`                          | String | Notebook title            |
| `notebook.id`                             | String | Notebook  ID              |
| `notebook.url.pure`                       | String | Notebook  URL             |
| `notebook.url.md`                         | String | Notebook  URL, add `[]()` |
| `notebook.url.html`                       | String | Notebook  URL, add `<a>`  |

### Parent Card / Children Card

You can actually get all the above information about the current card's parent and child cards as well.

| Variables Name | Type         | Description                                       |
| -------------- | ------------ | ------------------------------------------------- |
| `parent`       | Object       | `parent.titles` is the parent's `titles`          |
| `children`     | Object Array | `children.0.titles` is the first child's `titles` |

::: v-pre

## Functions

| Function Name <div style="width:80px"/> | Description                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `nohl`                                  | Remove `**`, it's highlight symbol                                                |
| `blod`                                  | Modify `**highlight**` to `<b>highlight</b>`                                      |
| `cloze`                                 | Modify `**highlight**` to `{{c1::highlight}}`                                     |
| `clozeSync`                             | Modify `**highlight**` to `{{c1::highlight}}`, synchronous show answers           |
| `upper`                                 | Capital letters                                                                   |
| `lower`                                 | Lower case                                                                        |
| `join`                                  | Merge an array of strings into a new string using the specified prefix and suffix |

The `join` function is a little more complicated, like `{{#join}} %["1"]. {{titles}}\n {{/join}}`. We know that `titles` is an array of strings, suppose its values are `["a" , "b", "c"]`. With this function, it will become

```
1. a
2. b
3. c
```

`%["1"]` is a magic variable that can be automatically numbered, see [syntax](./serial.md) for details.

::: tip
The last element will not be suffixed
:::

The join function allows us to add a before-and-after modifier to each string in the array, eventually merging them into a single string.