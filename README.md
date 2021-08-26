<p align="center">
  <a href="https://github.com/ourongxing/ohmymn">
    <img src="assets/logo.svg" alt="Logo" width="100" height="100">
  </a>
  <h3 align="center">OhMyMN</h3>
  <p align="center">可能是最强大的 Marginnote3 插件</p>
</p>
<p align="center">
  <a href="https://github.com/ourongxing/ohmymn/network/members"><img src="https://img.shields.io/github/forks/ourongxing/ohmymn.svg?style=flat" alt="forks"></a>
  <a href="https://github.com/ourongxing/ohmymn/stargazers"><img src="https://img.shields.io/github/stars/ourongxing/ohmymn.svg?style=flat" alt="stars"></a>
  <a href="https://github.com/ourongxing/ohmymn/blob/main/package.json"><img src="https://img.shields.io/badge/ohmymn-v0.9.0-orange" alt="version"></a>
    <a href="https://github.com/ourongxing/ohmymn/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
</p>
<p align="center">
  <a href="https://github.com/ourongxing/ohmymn/releases">下载</a> ·
  <a href="https://github.com/ourongxing/ohmymn/issues">报告 Bug</a> ·
  <a href="https://github.com/ourongxing/ohmymn/issues">提出新需求</a>
</p>

<img src="assets/p1.png">

# ohmymn

> ohmymn is the project name and OhMyMn is the addon name. Since OhMyMN is mainly for Chinese users and I am preparing for my exams, I have no plans to internationalize, but PR is welcome !

OhMyMN 的**设计理念**是通过高度自定义的设置来对摘录进行无感处理，让你觉得一切都是那么自然。OhMyMN 专注于**摘录，评论，标题，卡片**的相关处理，有且只有两种触发方式，一是摘录时自动触发，二是选中卡片（可多选）后点击按钮执行指定操作，避免了一切误触的可能性（我甚至提供了双击展开控制面板的选项）。[**查看使用文档（Not yet completed）**](https://github.com/ourongxing/ohmymn)

ohmymn 作为插件面板，本身就是多个插件的集合，如果你认同我的设计理念，那么你可以为 ohmymn 开发插件，使得 ohmymn 更加强大。当然你也可以另起炉灶，毕竟 ohmymn 已经踩过了大部分的坑。

## Feature

- 插件化，尽管目前不能完全解耦，下一个目标是设计一个编译器，预先编译插件。
- 配置管理，支持全局配置，文档配置，尽管设计的也不是很好，目前仅 ohmymn 中的配置支持文档配置。
- 完全 TS 化，提供所有 MN API 的类型文件和部分 UIKit 的类型文件。注：MN 的类型文件来自于 [mn-addon-api](https://github.com/aidenlx/mn-addon-api)

## Layout

```shell
├── addons  // ohmymn 插件目录
├── jsExtension // MN 插件目录，包含事件响应以及生命周期
├── settingViewController // 设置面板，一般不用管
├── utils // 一些方法
├── main.ts // 入口文件
└── profile.ts // 配置文件
```

插件由三个部分组成

- config: 设置项，展示到控制面板上，其中又可以分为
  - name: 插件名
  - Intro: 插件介绍
  - link: 插件的相关链接，可跳转
  - settings: 设置项
  - actions: MagicAction 中的菜单，统一放在最顶上的 MagicAction 中，方便操作。
- util: 插件的方法，一般用于 action 和摘录自动执行，在插件外使用时统一 `utils.插件名(小写).方法名` 即可。
- action: 实现 config-actions 中的动作，为选中卡片后点击执行。
- 具体结构可以查看 [相关代码](https://github.com/ourongxing/ohmymn/blob/main/src/addons/addon-anotherautotitle.ts) 。

## Disadvantages

- profile 要自己写，在 profile.ts 文件中，才能有提示，可以写脚本生成，这个以后会放在编译器里面。

- 需要自己插入到具体的摘录执行的过程中去。

## Development

```shell
git clone https://github.com/ourongxing/ohmymn.git
cd ohmymn && yarn
yarn dev // 先修改 rollup.config.js 中的用户名
```

每次修改代码后需要重启 MN，建议使用`自动操作`来快捷重启。调试可以使用`控制台`查看，筛选输入 `MNLOG`。

注： 自动操作和控制台均为 Mac 上自带的软件，这意味着您需要 Mac 系统来进行开发。

## Contact

除了 Github，你还可以在下面三个平台找到我，我会在即刻上发布更新说明和使用技巧，欢迎来即刻关注我。

* 即刻: [ourongxing](https://m.okjike.com/users/7f422d5d-d79a-4f45-9880-b89d64d7f37a)
* 知乎: [ourongxing](https://www.zhihu.com/people/ourongxing)
* Telegram: [ourongxing](https://t.me/orongxing)

## License

该项目签署了MIT 授权许可，详情请参阅 [LICENSE](https://github.com/ourongxing/ohmymn/blob/main/LICENSE)

## Acknowledgements

* [mn-addon-api](https://github.com/aidenlx/mn-addon-api)  MN API 的类型文件。
* [obsidian-bridge](https://github.com/aidenlx/obsidian-bridge) 这是第一个使用 TS 开发 MN 插件的项目，使得我在使用 TS 重构 ohmymn 时非常顺利。
* [pangu.js](https://github.com/vinta/pangu.js) 为中英文之间添加空格，十分有效。

## Sponsor

这是一次很糟糕的开发体验，为了开发 ohmymn， 我装了黑苹果，买了 Mac 端的 MN，花费了大量的时间来踩坑和填坑（我还在考研复习）。如果本项目对您有所帮助，或者对您的开发有所启发，欢迎给小猫买点吃的，我也会尽可能为您解答疑问。

![donate](assets/donate.gif)
