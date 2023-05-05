# 项目结构
所有的代码都在 `src` 目录下，`src` 目录下的文件结构如下：
```
├── jsExtension
│  ├── handleExcerpt
│  ├── handleMagicAction
│  ├── fetchNodeProperties.ts
│  ├── handleGestureEvent.ts
│  ├── handleReceivedEvent.ts
│  ├── index.ts
│  ├── lang.ts
│  ├── lifecycle.ts
│  ├── mustacheFunc.ts
│  └── switchPanel.ts
├── settingViewController
│  ├── handleUserAction.ts
│  ├── index.ts
│  ├── lang.ts
│  ├── lifecycle.ts
│  └── settingView.ts
├── modules
│  ├── addon
│  ├── ai
│  ├── aiassistant
│  ├── aitranslte
│  ├── anotherautodef
│  ├── anotherautotitle
│  ├── autocomment
│  ├── autocomplete
│  ├── autoformat
│  ├── autolist
│  ├── autoocr
│  ├── autoreplace
│  ├── autosimplify
│  ├── autostyle
│  ├── autotag
│  ├── autotranslate
│  ├── copysearch
│  ├── gesture
│  ├── magicaction4card
│  ├── magicaction4text
│  ├── shortcut
│  └── index.ts
├── profile
│  ├── default.ts
│  ├── index.ts
│  ├── lang.ts
│  ├── profileAction.ts
│  ├── profileAuto.ts
│  ├── rewrite.ts
│  ├── typings.ts
│  ├── updateDataSource.ts
│  └── utils.ts
├── typings
│  ├── AutoUtils.ts
│  ├── DataSource.ts
│  ├── index.ts
│  ├── Module.ts
│  └── utils.d.ts
├── utils
│  ├── third party
│  ├── checkInput.ts
│  ├── index.ts
│  ├── input.ts
│  ├── lang.ts
│  ├── number.ts
│  └── text.ts
├── dataSource
│  ├── index.ts
│  ├── lang.ts
│  └── more.ts
├── addon.ts
├── coreModule.ts
├── main.ts
└── self.d.ts
```
可以发现 OhMyMN 是一个相当复杂的项目。当然里面大部分的代码都与具体的功能实现有关，也就是摘录处理和卡片处理，我会特别标注出来 <Badge type="warning" text="just ohmymn addon" />，如果只想用 OhMyMN 模版开发新的插件，你可以跳过。

## jsExtension
```
├── handleExcerpt
│  ├── genNewExcerpt.ts
│  └── index.ts
├── handleMagicAction
│  ├── handleCardAction.ts
│  ├── handleTextAction.ts
│  └── index.ts
├── fetchNodeProperties.ts
├── mustacheFunc.ts
├── handleGestureEvent.ts
├── handleReceivedEvent.ts
├── index.ts
├── lang.ts
├── lifecycle.ts
└── switchPanel.ts
```

这个文件夹就是整个插件的核心。
- `handleExcerpt` 自动处理摘录，将所有模块的摘录处理功能集中在这里，按流程自动执行 <Badge type="warning" text="just ohmymn addon" />。
- `handleMagicAction` 执行动作，将所有模块的动作集中在这里执行。包括文字动作和卡片动作。
- `fetchNodeProperties.ts` `mustacheFunc` 用于模版引擎读取卡片属性。<Badge type="warning" text="just ohmymn addon" />
- `handleGestureEvent.ts` 手势相关。<Badge type="warning" text="just ohmymn addon" />
- `handleReceivedEvent.ts` 接收事件，处理事件。
- `switchPanel.ts` 切换面板显示。
- `lifecycle.ts` 插件生命周期。

## settingViewController
settingViewController 也就是控制面板，
```
├── handleUserAction.ts
├── index.ts
├── lang.ts
├── lifecycle.ts
└── settingView.ts
```

- `lifecycle.ts` 控制面板的生命周期。
- `settingView.ts` 控制面板的 UI 渲染。
- `handleUserAction.ts` 处理用户的操作，比如点击按钮，输入框等，然后发送通知，这样就可以在 `jsExtension/handleReceivedEvent.ts` 中接收到通知，然后执行相应的操作。

需要注意的时，控制面板和插件是两个不同的 OC 对象，他们的通信是通过发送通知来实现的。而且他们的 self 是不一样的。需要在 `jsExtension/lifecycle.ts` 手动给 settingViewController 实例传递数据。

```ts
// 实例化
self.settingViewController = SettingViewController.new()
self.settingViewController.addon = self.addon
self.settingViewController.dataSource = self.dataSource
self.settingViewController.globalProfile = self.globalProfile
self.settingViewController.docProfile = self.docProfile
self.settingViewController.notebookProfile = self.notebookProfile
```

在点击插件图标的时候，通过
```ts
MN.studyController.view.addSubview(self.settingViewController.view)
```
在 MarginNote 界面上添加控制面板。这部分的代码在 `jsExtension/switchPanel.ts` 中。

## modules
模块。每个模块有自己的选项，可以在控制面板中设置，有自己的动作。在 OhMyMN 中，模块分为了必选模块和可选模块，可选模块可以选择是否启用，但这属于<Badge type="warning" text="just ohmymn addon" />，在提供的模版中都为必选模块。

在 `modules/index.ts` 中注册。
## profile
```
├── default.ts
├── index.ts
├── lang.ts
├── profileAction.ts
├── profileAuto.ts
├── rewrite.ts
├── typings.ts
├── updateDataSource.ts
└── utils.ts
```
Profile 配置文件。Profile 在 OhMyMN 中非常重要。
- `default.ts` 默认配置，其中的 key-value 将会用于控制面板的渲染，根据 value 类型限制其使用对应的菜单选项样式，并提供代码提示。所以要开发新的模块，必须要先在这里填入默认配置。
- `profileAction.ts` 配置管理的动作，用于导出和导入配置。
- `profileAuto.ts` 配置的读取和写入。
- `rewrite.ts` 重写配置文件，用于兼容旧版本。
- `updateDataSource.ts` 更新数据源，重新渲染控制面板。

## dataSource
控制面板的数据源，用于渲染控制面板。根据模块中的 `settings` 生成。
## coreModule.ts
整理模块中的属性和方法，汇集在一起。
## addon.ts
一个全局变量，用于存储插件的一些信息以及数据。
::: warning 注意
全局变量在不同的 MN 窗口中共享。如果不想共享，请挂载到 self 上。
:::
## self.d.ts
`self` 的类型，用于代码提示。可以任意添加属性。self 上的属性在不同的 MN 窗口中无法共享。前面也说过，不同 OC 对象的 self 不一样。
## main.ts
插件入口。