# Basic Concepts

## Excerpt, Note, Card/Node, Comment

- Excerpt. Excerpt can be used as both a verb and a noun. It refers either to the process of selecting text or image from a document, color-coding it, and turning it into a mindmap card, or to the text/image itself. Here it refers specifically to excerpts from a document. Texts dragged form anywhere else, e.g. browser, are considered as comments.
- Note. Excerpts are actually notes. Each excerpt is assigned a `noteid`, which is also the URL of the card.
- Card/Node. Node is used in the context of mindmaps, and it can also refer to the card itself. A card can contain excerpts, comments, tags, links, and many other components. One card can only have one excerpt in principle.
- Comment. In fact, the tags and links described above are essentially comments. The characteristic of a comment is that it is not associated with a document. An excerpt, on the other hand, will have some properties related to the original document. One card can only have one excerpt in principle. However, when you merge two cards, the merged excerpt will become a comment in disguise. In OhMyMN, the merged excerpt is still considered as an excerpt. One thing about comments is that you can't edit them directly. You can only delete and re-add them. A lot of the processings for excerpts in OhMyMN are not compatible with comments.

## Card/Node, Parent/Child Card, Ancestor Card, Descendant Card

As mentioned before, cards are nodes and nodes are cards. In this documentation, the same concept may be referred to in one or the other form. If you have learned about data structures, you would know that one of a data structure is a tree. MarginNote's mindmap is essentially a tree.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221104222124.png?x-oss-process=base_webp)

The parent node is easy to understand. A parent node is the node directly before the current node. One node can only have one parent node and can have multiple child nodes.

Ancestor nodes are all the nodes before the current node, whether connected to it directly or indirectly, which includes the parent node of parent node, etc.

Descendant nodes are all the nodes behind the current node, whether connected to it directly or indirectly, which includes the child nodes of child nodes, etc.

## Hand Tool, Text Tool, Rectangular Tool & Lasso Tool

Just like PhotoShop's selection tools, MarginNote has a number of selection tools that let you select and excerpt an area or text in a document. Except for the hand tools, other tools will automatically excerpt contents after selection.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220507111341.png?x-oss-process=base_webp)

I usually use the hand tool. Dragging a selection area into the mindmap will automatically excerpt and create the card. This also allows you to control the position of the card.

When using the other three selection tools, the `Auto Add to MindMap` function is enabled. The automatic insertion position is set to `Auto Insertion Position` so that you can quickly make batch excerpts and create a mindmap.

## Title link, Merge titles

Title links are great for highlighting the title of a card in the document, and linking it back to the card. A card can have multiple titles via `;` or `;`. Each title will link to the card. One of the creative breakthroughs of OhMyMN is the automation of the process of generating titles and merging existing ones.

## Drag selection to MindMap

In the Home Screen of MarginNote, there is an entry of `Drag selection to MindMap`. When you drag the selected area A into the mindmap and drop it onto an existing card B, there are 2 options:

1. Card A will become a child node of card B.
2. Card A will be merged into card B.

There are pros and cons for each of the options. `Add as Child` is convenient for excerpting and managing mindmap structures. Use [AutoStyle](modules/autostyle.md) to automatically set the same color for cards at the same level. `Merge into` is more important in OhMyMN. Together with [AutoTitle](modules/anotherautotitle.md), [AutoDef](modules/anotherautodef.md), and other modules that can generate titles, it is also possible to turn new excerpts into titles and continue merging them, which utilizes the title links.

You may wonder if it is possible to do both. Actually, there is. When you drag and drop a selection onto a selection that has already been excerpted from the document, it will merge them directly even if you set it to `Add as Child`.