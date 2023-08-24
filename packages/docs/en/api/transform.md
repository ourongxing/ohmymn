# Objective-C API 转换

MarginNote 一开始只提供了 Objective-C 版的 API，而 TypeScript 版的 API 则是通过 Objective-C API 转换而来。这里简单介绍一下转换的过程，以及注意事项。目前 UIKit 和 Foundation 的 API 只有部分有 TypeScript 版本，如果需要使用，可以参考这里的方法自行转换。也欢迎参与到 API 转换工作中来。

- [Objective-C 版 API](https://github.com/ourongxing/ohmymn/tree/main/packages/api/Objective-C-API)
- [TypeScript 版 API](https://github.com/ourongxing/ohmymn/tree/main/packages/api/src/low-level)

## JSExport

官方文档：https://developer.apple.com/documentation/javascriptcore/jsexport


通过 JSExport 协议导出的类，会在 JavaScript 中表现为一个构造函数对象，可以通过 new 来创建实例。

对于导出的每个实例方法，会作为原型上的方法。对于导出的每个 Objective-C 属性，会作为原型上的属性。对于导出的每个类方法，会作为构造函数上的方法。

::: tip
ES6 中的 class 其实就是构造函数的语法糖。如果对 JavaScript 原型链不熟悉的话，可以将构造函数看作对象，原型看作实例。构造函数上的方法就是对象的静态方法，原型上的方法就是对象的实例方法。

最终的转换可以理解为
- OC 类 -> JS 对象
- OC 类的实例 -> JS 对象的实例
- OC 类方法 -> JS 对象的静态方法
- OC 类属性 -> JS 对象的实例属性
- OC 实例方法 -> JS 对象的实例方法
:::

而变量也会自动转换为 JavaScript 对应的类型，如下表所示：
|  Objective-C type   | JavaScript type |
| :-----------------: | :-------------: |
|         nil         |    undefined    |
|       NSNull        |      null       |
|      NSString       |     string      |
| NSNumber ,NSInteger |     number      |
|    NSDictionary     |   Object, {}    |
|       NSArray       |      Array      |
|       NSDate        |      Date       |
|       JSValue       |    Function     |
|         id          |  any，调试查看  |
|        Class        |    构造函数     |



下面的代码示例说明如何采用 JSExport 协议:

```c
#import "MbBookNote.h"

@import Foundation;
@import JavaScriptCore;
@class MbTopic;
@class MbBook;
// 表示将 JSBMbBookNote 类及其实例方法、类方法和属性导出到 JavaScript 代码。
@protocol JSBMbBookNote <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

// 属性，可读可写
@property (nonatomic,readwrite,getter=highlight_text,setter=_setHighlightText:) NSString * excerptText;

// 属性，只可读
@property (nonatomic,readonly,getter=noteid) NSString * noteId;

// 实例方法，返回值类型为 NSString，没有参数
- (NSString*) allNoteText;

// JSExportAs 表示重命名导出
// 如果没有重命名，导出的方法名应该为 appendHtmlCommentTextTag，这种有多个参数的函数可以理解为将函数名拆开，逐个解释其参数。你只需要将冒号前的参数名拼接起来，并且首字母大写，就是导出的方法名。
JSExportAs(appendHtmlComment,
- (void)appendHtmlComment:(NSString*)html text:(NSString*)text tag:(NSString*)tag);
// 实例方法，没有返回值，参数有 text, 类型为 NSString
- (void)appendTextComment:(NSString*)text;

// 类方法，前面是 + 号。在 JS 中的方法名应该是 createWithTitleNotebookDocument。返回一个 MbBookNote 实例。这个类理论上来说应该是 MbBookNote，但是 MarginNote 内部暴露出的是 Note。所以需要用 Note.createWithTitleNotebookDocument 来执行。对于 Foundation 和 UIKit 中的类，可以直接将 JSBMbBookNote 删除 JSB 剩下的部分作为类名。
+ (MbBookNote *)createWithTitle:(NSString *)title notebook:(MbTopic*)topic document:(MbBook*)book;

#pragma clang diagnostic pop
@end
```

转换到 TypeScript 之后，会变成这样：
```ts
declare class MbBookNote {
  excerptText: string
  readonly noteId: string
  allNoteText(): string
  appendHtmlComment(html: string, text: string, tag: string): void
  appendTextComment(text: string): void
}

declare global {
  const Note: {
    createWithTitleNotebookDocument(
      title: string,
      notebook: MbTopic,
      doc: MbBook
    ): MbBookNote
  }
}
```

这样做的好处是 MbBookNote 可以作为类型进行导出和导入，而不是作为全局变量，避免全局变量满天飞。而 Note 则是作为全局变量，可以直接使用。会使用到静态方法的对象都必须作为全局变量。就算这里不是 Note，而是 MbBookNote，也仍然需要这样。实际上，所有的 low-level API 都是全局变量，运行时会被自动注入。


## ⚠️ 注意
1. 创建实例
   - 如果有类方法，可以直接使用类方法创建实例。比如上面的 `Note.createWithTitleNotebookDocument()`
   - 大多数时候会有一个默认的 `.new()` 的类方法。比如 `NSNull.new()`
   - 如果 `.new()` 不行，可以使用 new 关键字。如 `new UISwitch()`，并且 UISwitch 必须作为全局变量。
2. 要导入类型，必须使用 `import type`，而不是 `import`。尤其是存在同名全局变量时，如果不加 type，会导致类型错误。
    ```
    import type { MbBookNote } from 'marginnote'
    ```
3. 多个参数的函数名称。 JSExportAs 表示重命名导出。如果没有重命名，导出的方法名应该为 appendHtmlCommentTextTag，这种有多个参数的函数可以理解为将函数名拆开，逐个解释其参数。你只需要将冒号前的参数名拼接起来，并且首字母大写，就是导出的方法名。
    ```c
    JSExportAs(appendHtmlComment,
    - (void)appendHtmlComment:(NSString*)html text:(NSString*)text tag:(NSString*)tag);
    ```
4. 多个参数的函数，参数名有可能写全了不一定能运行，有时候少一个参数才能运行，需要自己尝试。