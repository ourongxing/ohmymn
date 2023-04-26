<script setup>
import Shortcut from '/.vitepress/components/Shortcut-en.vue';
</script>
# Shortcut

::: warning Note
This feature is provided entirely by OhMyMN and is not affiliated with MarginNote.

This "Shortcut" is just a url.
:::

Trigger actions in MagicAction via URL Scheme, and set shortcut keys to open URLs on Mac.

1. Open `marginnote3app://addon/ohmymn?type=card&shortcut=1` could trigger first card action.
2. Open `marginnote3app://addon/ohmymn?type=text&shortcut=2` could trigger second text action.

## Custom Shortcuts

URLs can be set for each action as well as for any input value, and set them as shortcut keys. It is even possible to execute multiple actions at the same time, changing the order of execution by the order of selection.

::: warning Shortcut Generator
[Find custom shortcuts shared by others](https://busiyi.notion.site/56fa8c4a189240ac88cfc33c1aa42c0f?v=acc4098de9c1497c8b191dda25af718a)

<Shortcut/>
:::


## Use shortcut keys to open url
### iPad
1. Install a apple shortcut https://www.icloud.com/shortcuts/d9027fc514f04fc4add78ae506baba8d
2. Open Settings, then tap Accessibility.
3. Tap Keyboards.
4. Tap Full Keyboard Access and turn it on.
5. Tap Commands.
6. Tap a command, then press a custom key combination to assign to it.
### Mac

There are many tools for the Mac, I usually use Karabiner-Elements, which also allows you to set shortcuts to MarginNote separately, for free. Raycast is also very suitable and even simpler.

## Use gesture to open url

The [Gesture](gesture.md) module can be used on iPad to open URLs to use the power of shortcuts.