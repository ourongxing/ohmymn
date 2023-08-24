# Profile Management

::: tip Profile
I like to call the configuration/setting as the profile, also like to call the plugin as the addon.
:::


## Profile Structure

::: tip

The notebook profile and the doc profile are annotated with instructions. Those without instructions are global profiles.

- [Only Current Notebook]
- [Only Current Document]

:::

- Global Profile x 4: Different global profiles can be selected for different notebooks. Multiple global profiles are used for several different learning scenarios. For example, if you have 4 subjects, then you can use exactly 4 sets of profiles. If you feel that 4 sets are not enough, then I think you should make them as compatible as possible. Try to find the greatest common factor among different learning scenarios and balance flexibility and convenience.
- Doc Profile: different for each document.
- Notebook Profile: different for each notebook.

## Initialize

If you think the initial profile doesn't suit your needs and it's too tedious to modify different notebooks or documents one by one. Don't worry, I've already thought of it. You may have noticed that the last item in `OhMyMN-Select Global Profile` is called `Initialize`. When you make changes to this profile, it will be synchronized to all documents and notebooks. However, note that the options `OhMyMN-Select Global Profile` and `OhMyMN-Module Quick Switch` will not participate in the synchronization.

::: tip Update
[v4.1.1](https://github.com/ourongxing/ohmymn/releases) Improved. The initialized document profile and notebook profile will be used as the default profile for new documents and new notebooks.
:::

~~For document profiles and notebook profiles, the initialization will only work on documents or notebooks that have already been opened.~~

## Export & Import

You can also export all your profiles to mindmap cards so that they can be synchronized with MarginNote using iCloud. You can also share profiles by exporting your notebook. For more information, you can continue reading [MagicAction for Card —— Manage Profile](modules/magicaction4card#manage-profile).

## Reset & Sync Multi-window Profiles

OhMyMN profile changes in the case of multiple windows will not be synchronized immediately. You can force the synchronization with [MagicAction for Card —— Manage Profile —— Sync Profile With Other Windows](modules/magicaction4card#manage-profile).

Use [MagicAction for Card-Manage Profile —— Reset Profile](modules/magicaction4card#manage-profile) to reset the profile. The option to reset the configuration is also provided when deactivating or uninstalling the plugin.

## Write Custom Input Content to Mindmap Cards

Based on MarginNote's mindmap, OhMyMN can also write custom input content into the mindmap cards for easy arrangement. For more information, you can continue reading [Custom Input Format](custom.md#mnlink).