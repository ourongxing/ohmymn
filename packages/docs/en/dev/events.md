# 事件监听
在特定事件发生时会自动调用事件处理的方法。大多数事件都是摘录有关。

## 添加/移除事件监听
通常在打开笔记本的时候添加事件监听。 比如当 `ProcessNewExcerpt` 调用 `onProcessNewExcerpt` 方法，也就是摘录时触发。
```js
NSNotificationCenter.defaultCenter().addObserverSelectorName(
  self,
  "onProcessNewExcerpt:",
  "ProcessNewExcerpt"
)
```

注意这里有一个 `:`。然后我们创建一个 `onProcessNewExcerpt` 函数，这个函数要作为插件对象的实例方法。

在关闭笔记本的时候移除事件监听。

```js
NSNotificationCenter.defaultCenter().removeObserverName(
  self,
  "ProcessNewExcerpt"
)
```

可以导入 [事件监听控制器](../api/marginnote/dev.md#eventobservercontroller)，同时监听多个事件。
```ts
import { eventObserverController } from "marginnote"
```
## 所有事件
事件处理函数可以接收到一个 `sender` 对象，可以通过 `sender.userInfo` 得到事件传递来的参数。

### AddonBroadcast
打开 `marginnote3app://addon/ohmymn?type=card&shortcut=1` 这种格式的 URL 时触发。

`userInfo.message` 就会得到 `ohmymn?type=card&shortcut=1`

### ProcessNewExcerpt
从 PDF 中摘录时触发。

`userInfo.noteid` 可以得到当前摘录的笔记 id。
### ChangeExcerptRange
修改 PDF 中摘录选取的范围时触发。

`userInfo.noteid` 可以得到当前笔记的 id。


### PopupMenuOnNote
点击笔记，弹出菜单时触发。点击 PDF 中的摘录选区以及脑图中的卡片都属于点击笔记，所有都会触发。

`userInfo.note` 可以得到点击的笔记对象。注意，这里直接是笔记对象。
### ClosePopupMenuOnNote
笔记菜单消失时触发。

`userInfo.note` 可以得到点击的笔记对象。

### PopupMenuOnSelection
在 PDF 中框选文字或区域后，弹出菜单时触发。

```js
userInfo = {
  arrow,
  documentController,
  winRect
}
```

如果想要得到选中的文字，可以用

`userInfo.documentController.selectionText`

得到选中的文字。
### ClosePopupMenuOnSelection
选中文字的菜单消失时触发，同上。
### OCRImageBegin
OCR 开始时触发，包括摘录时自动 OCR 以及手动 OCR。
### OCRImageEnd
OCR 结束时触发