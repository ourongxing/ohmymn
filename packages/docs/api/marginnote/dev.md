# 开发相关

一些简化开发的工具方法。主要为了 TypeScript 类型检查。

## defineLifycycleHandlers

```ts
declare function defineLifecycleHandlers(events: {
    instanceMethods?: Partial<JSExtensionLifeCycle.InstanceMethods>;
    classMethods?: Partial<JSExtensionLifeCycle.ClassMethods>;
}): {
    instanceMethods?: Partial<Partial<{
        sceneWillConnect(): void;
        sceneDidDisconnect(): void;
        sceneWillResignActive(): void;
        sceneDidBecomeActive(): void;
        notebookWillOpen(notebookid: string): void;
        notebookWillClose(notebookid: string): void;
        documentDidOpen(docmd5: string): void;
        documentWillClose(docmd5: string): void;
    }>> | undefined;
    classMethods?: Partial<Partial<{
        addonDidConnect(): void;
        addonWillDisconnect(): void;
        applicationDidEnterBackground(): void;
        applicationWillEnterForeground(): void;
        applicationDidReceiveLocalNotification(notify: any): void;
    }>> | undefined;
};
```

提供生命周期函数的类型声明。

举个例子：
```ts
import { MN, defineLifycycleHandlers } from "marginnote";

export default defineLifecycleHandlers({
  instanceMethods: {
    sceneWillConnect() {
      MN.log("sceneDidBecomeActive");
    },
    notebookWillOpen(notebookid) {
      MN.log(notebookid);
    }
  },
});
```


## defineEventHandlers
```ts
declare function defineEventHandlers<K extends string>(h: {
    [M in K extends `on${string}` ? K : `on${K}`]: (sender: {
        userInfo: UserInfo<M>;
    }) => void;
}): { [M in K extends `on${string}` ? K : `on${K}`]: (sender: {
    userInfo: UserInfo<M>;
}) => void; };

type UserInfo<K> = K extends
  | "onPopupMenuOnSelection"
  | "onClosePopupMenuOnSelection"
  ? {
      winRect: string
      arrow: DirectionOfSelection
      documentController: DocumentController
    }
  : K extends "onPopupMenuOnNote" | "onClosePopupMenuOnNote"
  ? { note: MbBookNote }
  : K extends "onChangeExcerptRange" | "onProcessNewExcerpt"
  ? { noteid: string }
  : K extends "onAddonBroadcast"
  ? { message: string }
  : Record<string, any>
```
提供事件处理函数的类型声明，进行类型检查。

举个例子：
```ts
const events = [
  "ClosePopupMenuOnNote",
  "ClosePopupMenuOnSelection"
] as const

export default defineEventHandlers<(typeof events)[number]>({
   onClosePopupMenuOnNote(sender) { }
   onClosePopupMenuOnSelection(sender) { }
})
```

## eventObserverController
```ts
declare function eventObserverController(observers: ({
    event: string;
    handler?: string;
} | string)[]): {
    add: () => void;
    remove: () => void;
};
```

事件监听控制器，可以用于添加和移除监听。

```ts
const events = [
  "ClosePopupMenuOnNote",
  "ClosePopupMenuOnSelection"
] as const

export const eventObservers = eventObserverController(events)

// lifecycle.ts
notebookWillOpen(){
    eventObservers.add()
}
notebookWillClose(notebookid: string) {
    eventObservers.remove()
}
```

## i18n
```ts
declare function i18n<M, N>(lang: {
    zh: M;
    en: N extends M ? M : M;
}): M;
```
提供国际化的支持，根据系统语言自动切换。目前支持中文和英文，提供类型检查。

举个例子：
```ts
import { i18n } from "marginnote"

export default i18n({
  zh: {
    none: "无",
  },
  en: {
    none: "None",
  }
})
```

## getObjCClassDeclar
```ts
/**
 * @param name Objective-C Class name
 * @param type Objective-C Class type
 */
declare function getObjCClassDeclar(name: string, type: string): string;
```
提供 JSB 类的声明，用于 JSB.defineClass 的第一个参数。 举个例子，OhMyMN 就是这样定义的
```ts
JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), {}, {})
```

实际上返回的值就是 `OhMyMN: JSExtension`。