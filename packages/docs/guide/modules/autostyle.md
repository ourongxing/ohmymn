# AutoStyle
AutoStyle 可以单独设置并且固定文本摘录和图片摘录（划框和套索）默认的颜色和样式，同时还可以根据各种预设来自动设置颜色和样式。

### 预设

::: warning
OhMyMN 只能在摘录或修改摘录的时候才能触发，拖拽卡片，合并卡片均不会触发，但是可以用手势配合`修改摘录颜色-使用 AutoStyle 的设置`来刷新颜色。
:::

有四个预设，一个关于样式，三个关于颜色。

1. 样式由字数或面积决定：因为一旦字数多了或面积大了，如果用填充，就会出现大面积的色块，从而分散注意力，此时应该切换为线框。

    - 输入：`[类中文字数, 类英文字数, 选区面积]`
    - 这里的字数和 [Another AutoTitle](anotherautotitle.md#预设) 中的字数是同一个概念。
    - 选区面积可以通过打开 `显示选区面积` 来获取。

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804014354.gif?x-oss-process=base_webp)

---

::: tip
颜色预设有优先级，`颜色跟随卡片` ⇒ `颜色跟随兄弟卡片` ⇒ `颜色跟随父卡片` ⇒ `默认`

也就是说同时开启这三个预设，如果合并进卡片里，就跟随卡片。如果是作为子节点，有兄弟卡片，就跟随兄弟卡片，如果没有就跟随父卡片。
:::

2. 颜色跟随卡片：将下方选项（MarginNote 主页设置）设置为 `合并入`，便可以在摘录时自动将颜色修改为拖拽合并进的卡片的颜色。

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804004454.png?x-oss-process=base_webp)

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804014701.gif?x-oss-process=base_webp)
3. 颜色跟随兄弟卡片：所谓兄弟卡片，就是同一个父卡片的卡片，我设置的是跟随第一个兄弟卡片。使用该预设最好是将上方选项设置为 `添加为子节点`。

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804015210.gif?x-oss-process=base_webp)

4. 颜色跟随父卡片：将上方选项设置为 `添加为子节点`，就可以跟随其父卡片。

    ![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic20220804015411.gif?x-oss-process=base_webp)

## [MagicAction for Card](magicaction4card.md#修改摘录颜色)
### 修改摘录颜色
- 输入颜色索引，1-16，也就是色盘从左到右，从上到下。
- `使用 AutoStyle 的设置`：使用预设来刷新颜色。

### 修改摘录样式
- `使用 AutoStyle 的设置`：使用预设来刷新样式。