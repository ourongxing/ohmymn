# MN 插件（Lite）

所谓 Lite 版插件，指一两百行代码的简单插件，并且使用 JavaScript 进行开发。这是为了区别于 OhMyMN 那种使用 TypeScript 开发，需要编译，有控制面板的插件。在 OhMyMN 发布之前的 MN 插件都属于 Lite 版插件。当然也并不是说 Lite 版插件无法开发复杂功能，只是不推荐。

一个 Lite 版插件通常只有三个文件：
1. logo.png
2. main.js
3. mnaddon.json

## CLI
为了更方便的开发 Lite 版插件，我们开发了一个命令行工具 [mnaddon](https://www.npmjs.com/package/mnaddon)。

该工具主要有以下命令
1. create: 使用模板创建新的插件项目。
2. resize: 调整 logo 大小为 44x44，这是 MN 插件要求的大小。
3. watch: 监听文件修改，并且将修改后的文件同步到 MN 插件目录。如果插件未安装，会自动安装。
4. restart: 每次修改代码后，需要重启 MN 才会生效。该命令还可以自动跳过未签名的警告。
5. dev: 打开 MN 和控制台，开始监听文件修改。
6. build: 打包成插件。
6. unpack: 解包插件。

不管是监听文件变化还是最终打包成插件，都只会处理 png，js，json 这三类文件。另外，请不要使用子文件夹，否则不会被监听或者打包。

### 安装
```shell
pnpm add mnaddon -g
```

### 使用
上面已经介绍了每个命令的作用，你还可以使用 `mnaddon help` 或者 `mnaddon help restart` 来查看每个命令具体的使用方法。 `<project-name>` 表示必填，`[output-name]` 表示可选。

```shell
# 创建新的插件项目，名为 template
mnaddon create template
# 进入项目目录
cd template
# 打包成插件
mnaddon build
```

## 示例

```js
;(function () {
  const zh = {
    confirm: "确定",
    cancel: "取消"
  }
  const en = {
    confirm: "OK",
    cancel: "Cancel"
  }
  const Addon = {
    name: "Template",
    key: "template"
  }
  // 同时适配中英文
  const lang = isZH() ? zh : en
  function isZH() {
    return (
      NSLocale.preferredLanguages().length &&
      NSLocale.preferredLanguages()[0].startsWith("zh")
    )
  }
  // 可以在 控制台.app 中查看 log 输出。可以通过 key 来筛选。
  const console = {
    log(obj) {
      JSB.log(`${Addon.key} %@`, obj)
    }
  }

  // 弹窗
  const popup = (title, message, buttons = [lang.confirm]) => {
    return new Promise(resolve =>
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title,
        message,
        0,
        lang.cancel,
        buttons,
        (alert, buttonIndex) => {
          resolve({
            option: buttonIndex - 1
          })
        }
      )
    )
  }

  JSB.newAddon = () => {
    const showHUD = (text, duration = 2) => {
      self.app.showHUD(text, self.window, duration)
    }
    const go = async () => {
      const { option } = await popup(
        "Template Popup",
        "Whether to view the Chinese development documents (old version, new version is not updated)?"
      )
      if (option === -1) return
      self.app.openURL(
        NSURL.URLWithString(encodeURI("http://docs.test.marginnote.cn/"))
      )
    }
    // 返回一个 JSExtension 类，也就是插件
    return JSB.defineClass(
      Addon.name + ": JSExtension",
      {
        // 新的 MN 窗口打开
        sceneWillConnect() {
          self.status = false
          self.app = Application.sharedInstance()
          self.studyController = self.app.studyController(self.window)
        },

        // 设置插件按钮图标以及选中状态。点击插件按钮会触发 "onToggle" 方法。
        // 只在脑图模式下才显示图标。
        queryAddonCommandStatus() {
          return self.studyController.studyMode !== 3
            ? {
                image: "logo_44x44.png",
                object: self,
                selector: "onToggle:",
                checked: self.status
              }
            : null
        },

        // 点击插件图标执行的方法。效果就是按钮被选中，然后弹窗，然后取消选中。
        async onToggle() {
          self.status = true
          // 刷新插件按钮状态
          self.studyController.refreshAddonCommands()
          await go()
          self.status = false
          self.studyController.refreshAddonCommands()
        }
      },
      {}
    )
  }
})()
```
这个插件的作用就是，点击插件按钮弹出一个对话框，点击确定后打开开发文档。