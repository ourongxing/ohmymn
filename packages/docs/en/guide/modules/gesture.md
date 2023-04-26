# Gesture

::: warning Note
Available for iPad only. This feature is provided entirely by OhMyMN and is not affiliated with MarginNote.
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/79b47e3272bf5eee9be5c5c9737ead591d312917.gif?x-oss-process=base_webp)

::: tip
Try to slide in the middle area slowly and for a long distance.
:::

Use gestures to trigger actions in MagicAction.


Trigger actions on MagicAction directly by sliding `up, down, left, right` on different toolbars in one step, without opening the control panel.

## Custom Shortcuts

You can trigger a custom shortcut with a gesture. You must enable the [Shortcut](./shortcut.md) module and turn on the `Custom Shortcuts`.


There are currently three areas with four directional gestures and two areas that are card-related and are used to trigger actions in [MagicAction for Card](magicaction4card.md).

### Card Related Toolbar

`Card Selection Toolbar`

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101445.png?x-oss-process=base_webp)

`Card Multi-Select Toolbar`
::: warning Note
If only a single card is selected but the multi-selection toolbar is manually enabled, the multi-selection toolbar gesture will not respond this time.
:::

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101505.png?x-oss-process=base_webp)


### Text Selection Toolbar

This area is related to text selection and is used to trigger the action in [MagicAction for Text](magicaction4text.md). The same holds for selecting a region.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101552.png?x-oss-process=base_webp)

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731101619.png?x-oss-process=base_webp)

These two have different menu styles, but both are part of the text selection toolbar. The first one will show options such as `Set Title` and `Add as Comment` because you have selected an excerpted note before this text is selected.

This has been specially handled by [MagicAction for Text](magicaction4text.md) and you can check it yourself. It is possible to add a formula directly to a card after OCR.

### Adjust the text selection toolbar recognition area

Given that some people have never been able to successfully trigger the gesture on the text selection toolbar, I suspect that the device screen size is the cause, so it's open to customization. You can follow the steps below to adjust it. Note that you need to swipe sideways at the top of the toolbar to get the closest value. Since I fixed the toolbar height, you only need to adjust the coordinates at the top, but don't fill it in randomly.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221104154735.gif?x-oss-process=base_webp)
## Blocked Area

The gesture detection is added to the entire MarginNote interface, and in theory， OhMyMN will pick up information when swiped anywhere. It's just that I've blocked it so that it only reponses in a few specified areas.

However, these toolbar positions are not judged as accurately as they could be, so it could lead to actions being performed by OhMyMN without swiping on the toolbar. To avoid such situations, I have further restricted the recognition area. In particular, the `Card Single Select Toolbar` is the most restricted.

As shown in the figure, if the `Card Single Select Toolbar` appears in the red box and you swipe inside the red box area, it will not respond.

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731113055.png?x-oss-process=base_webp)

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220731113307.png?x-oss-process=base_webp)
