# Introduction

::: tip Module
It is similar to plugins/addons, which are internal to OhMyMN.
:::

OhMyMN is essentially a toolbox. All the functionalities inside are in separate modules, each of which is provided with three capabilities:

1. When excerpting, modify the excerpted content or get the excerpted content and perform other operations.
2. After selecting a card in the mindmap, make changes to the card or get information and perform other operations.
3. After selecting text in a document, get the text or selection information and perform other operations.

Some modules may use all three capabilities, some may use only one of them, and some may use none of them with only a few options.

Modules that use the first capability usually start with Auto, such as AutoTitle and AutoDef, indicating that they can be executed automatically on excerpt (this is not by default though. You need to turn on `Auto Run When Excerpting`. Modules that use the first capability usually also use the second capability in order to handle cards that already exist.

The second and third capabilities are also often used together, for example, for copying, searching, and exporting. They have a common name - Action. The actions of all modules are in [MagicAction for Card](modules/magicaction4card.md) and [MagicAction for Text](modules/magicaction4text.md). The button, when clicked, performs the corresponding action.

Apart from that, all modules are divided into two main categories.

1. Required modules: Modules that cannot be disabled.
   - [OhMyMN](./modules/ohmymn)
   - [MagicAction for Card](./modules/magicaction4card): Some card-related actions
   - [MagicAction for Text](./modules/magicaction4text): Some text-related actions

2. Optional modules: You can select the modules to be enabled in the `OhMyMN —— Module Quick Switch`.

   - [Shortcut](./modules/shortcut): Use URL Scheme to trigger actions. You can set your own shortcut keys to open the URL Scheme.
   - [Gesture](./modules/gesture): Use gestures to trigger actions.
   - [CopySearch](./modules/copysearch): Copy or search for selected text or selected cards.
   - AutoX
     - [Another AutoTitle](./modules/anotherautotitle): Auto convert titles.
     - [Another AutoDef](./modules/anotherautodef): Auto split excerpts into two parts (title and excerpt) and extract the title.
     - [AutoFormat](./modules/autoformat): Auto format excerpts, such as automatically adding spaces.
     - [AutoComplete](./modules/autocomplete): Auto complete English word forms, fill in word information, and make word cards.
     - [AutoReplace](./modules/autoreplace): Auto replace the content in the excerpt.
     - [AutoList](./modules/autolist): Auto break the line at the specified position and add the serial number.
     - [AutoTag](./modules/autotag): Auto add tags or extract parts of the content as tags.
     - [AutoComment](./modules/autocomment): Auto add comments or extract parts of the content as comments.
     - [AutoStyle](./modules/autostyle): Auto set the excerpt color and fill style.
     - [AutoOCR](./modules/autoocr): Auto OCR recognition or correction of extracted selections.
     - [AutoTranslate](./modules/autotranslate): Auto translate the excerpted content.
     - [AutoSimplify](./modules/autosimplify): Auto convert from Traditional Chinese to Simplified Chinese.
   - ~~Export to X~~
     - ~~Export to Flomo~~
     - ~~Export to Anki~~
     - ~~Export to Devonthink~~