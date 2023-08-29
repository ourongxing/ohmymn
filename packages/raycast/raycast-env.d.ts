/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /**  - All of custom shortcuts and actions will be shown in Chinese */
  "actionInChinese": boolean,
  /** Your name - Displayed when you share shortcut */
  "username": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `create_normal_shortcuts_quicklink` command */
  export type CreateNormalShortcutsQuicklink = ExtensionPreferences & {}
  /** Preferences accessible in the `gen_custom_shortcut` command */
  export type GenCustomShortcut = ExtensionPreferences & {}
  /** Preferences accessible in the `find_custom_shortcuts` command */
  export type FindCustomShortcuts = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `create_normal_shortcuts_quicklink` command */
  export type CreateNormalShortcutsQuicklink = {}
  /** Arguments passed to the `gen_custom_shortcut` command */
  export type GenCustomShortcut = {}
  /** Arguments passed to the `find_custom_shortcuts` command */
  export type FindCustomShortcuts = {}
}


declare module "swift:*" {
  function run<T = unknown, U = any>(command: string, input?: U): Promise<T>;
  export default run;
	export class SwiftError extends Error {
    stderr: string;
    stdout: string;
  }
}
