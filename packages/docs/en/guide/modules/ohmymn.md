# OhMyMN

The options below are mainly for setting the properties of this panel and controlling other modules.

## Select Global Profile

::: tip Only Current Document
Only switch global profile, not notebook and document profile.
:::

[Profile Management](../profile.md) has mentioned the profile structure of OhMyMN, so I won't go over it here.

## Module Quick Switch

If a module is disabled or enabled, its options menu is no longer displayed after disabling it. Actions belonging to this module are also not displayed in MagicAction.

## Panel Position

- Document Inner Side: By default, the panel is displayed inside the document. Supports automatic following the document width adjustment.
- Document MindMap Middle: The panel is displayed in the middle between the document and the mindmap. Supports automatic following the document width adjustment.
- MindMap Inner Side: The panel is displayed inside the mindmap.
- Left
- Center
- Right

## Panel Height

Usually, with 12.9 inch iPad, you can choose `Higher` and with 11 inch ipad, you can still choose `Standard`. This way the input box at the bottom will not be covered by the keyboard.

## Panel Control

- Double-click the icon to open the panel: Double-click the smiley 😀 to open the panel so that you can avoid accidental touches.
- Close the panel after action execution: The panel will be automatically closed after the action in MagicAction is executed.

## Drag Merge to Generate Title

[Another AutoTitle](anotherautotitle.md), [Another AutoDef](anotherautodef.md), [AutoComplete](autocomplete.md) can be used to generate title.

By [draging selection](../concept.md#drag-selection-to-mindmap) to merge into the card, there are several ways to handle it:

- Never Generate Title
- Generate Title When Conditions Are Met: Automatically generate titles through the above modules.
- Always Generate Title: Even if the above modules do not generate a title, they go straight to the title.
### > Has Title
If a title is generated, but the card already has a title, there are several ways to handle it:

- Not Turn to Title
- Merge Title
- Override Title
### > The Dragged Excerpt Will

When you turn an excerpt into a title, you have two choices for the excerpt that you drag in:

- Remove Immediately
- Remove Later: the next time you excerpt or you exit the notebook or MarginNote, or MarginNote enters the background. The reason for this is to have the opportunity to adjust the excerpt selection.
## Lock Excerpt Text

Once enabled, if you change the excerpt selection in the document by accident while swiping through the document, OhMyMN will restore the text in the excerpt for you. When you create an excerpt, you can keep modifying it as long as the excerpt menu does not disappear. Once the menu disappears, the excerpt will be locked. This feature can also first excerpt a long paragraph and then shorten the selection to one word.

## Auto Backup Profile

::: warning Input
Card URL, such as `marginnote3app://note/F20F324D-61B3-4CA9-A64C-0C92645A1E33`
:::

Automatically saves the profile information to the MarginNote's mindmap card. Again make sure that the card has child cards, as the profile information is written on the child cards. The more child cards, the better the performance is, as this profile information will keep expanding and we want to avoid exceeding the maximum number of words for a single card.