<script setup>
import Shortcut from '/.vitepress/components/Shortcut.vue';
</script>
# Shortcut

::: tip 更新
[v4.0.6](/update.md) 新增
:::

::: warning 注意
该功能完全由 OhMyMN 提供，与 MarginNote 无关。如果你使用的是 MN4，注意把所有 URL Scheme 中的 `marginnote3app` 替换为 `marginnote4app`
:::

通过 URL Scheme 来触发 MagicAction 中的动作，在 Mac 上可以设置快捷键打开 URL。

1. 打开 `marginnote3app://addon/ohmymn?type=card&shortcut=1` 就可以触发第一个卡片动作。
2. 打开 `marginnote3app://addon/ohmymn?type=text&shortcut=2` 就可以触发第二个文字动作。

## 自定义捷径

可以为每个动作以及任意输入值设置 URL，并将其设置成快捷键。甚至可以同时执行多个动作，通过选择的顺序来改变执行的顺序。

::: warning 捷径生成器
[查找其他人分享的自定义捷径](https://busiyi.notion.site/901a63985532448e80ea493c461448c5?v=94f16166782c4285bf6fcb5937803d30)

<Shortcut/>
:::


## 使用快捷键打开 URL
### iPad
1. 点击安装快捷指令 https://www.icloud.com/shortcuts/d9027fc514f04fc4add78ae506baba8d
2. 设置-辅助功能-键盘-全键盘控制-命令-划到最下面就可以给快捷指令设置快捷键了。
### Mac

Mac 上的工具就很多了，我通常是使用 Karabiner-Elements，这个还可以单独给 MarginNote 设置快捷键，免费。Raycast 也非常合适，甚至更加简单。

## 使用手势打开 URL

iPad 上可以使用 [Gesture](gesture.md#自定义捷径) 模块来打开 URL，从而使用捷径的强大功能。