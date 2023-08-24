# 插件结构

MN 插件文件以 `.mnaddon` 为后缀，本质上是一个 `.zip` 压缩包，里面包含了插件的所有文件。[mnaddon](./lite.md#cli) 工具提供了打包和解包的命令。

### `mnaddon.json`
插件的描述清单，包含了插件的基本信息，比如名称、版本、作者等。
```json
{
  "addonid": "marginnote.extension.ohmymn",
  "author": "ourongxing",
  "title": "OhMyMN",
  "version": "4.2.0",
  "marginnote_version_min": "3.7.21",
  "cert_key": ""
}
```

- `addonid` 是插件的唯一标识，不能重复，统一使用 `marginnote.extension.` 开头，后面跟上你的插件 id/key。
- `marginnote_version_min` 是插件最低支持的版本，如果 MN 低于该版本，将无法安装。
- `cert_key` 是插件的签名，需要向 MarginNote 官方申请，[申请方法](https://bbs.marginnote.cn/t/topic/8042)。没有签名的插件默认无法安装，需要打开 `允许加载未经认证的插件` 选项，但是仍然会有弹窗警告。每次插件更新均需要重新申请签名。

### `main.js`
插件代码
###  `logo.png`
插件图标，尺寸必须是 44x44，否则会被缩放。文件名不限，需要在 `queryAddonCommandStatus` 中手动指定。