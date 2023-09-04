const modules = {
  required: [
    ["OhMyMN", "ohmymn"],
    ["MagicAction for Card", "magicaction4card"],
    ["MagicAction for Text", "magicaction4text"]
  ],
  optional: [
    ["Shortcut", "shortcut"],
    ["Gesture", "gesture"],
    ["Toolbar", "toolbar"],
    ["Another AutoTitle", "anotherautotitle"],
    ["Another AutoDef", "anotherautodef"],
    ["AutoFormat", "autoformat"],
    ["AutoComplete", "autocomplete"],
    ["AutoReplace", "autoreplace"],
    ["AutoList", "autolist"],
    ["AutoTag", "autotag"],
    ["AutoStyle", "autostyle"],
    ["CopySearch", "copysearch"],
    ["AutoTranslate", "autotranslate"],
    ["AutoOCR", "autoocr"],
    ["AutoComment", "autocomment"],
    ["AutoSimplify", "autosimplify"],
    ["AI", "ai"]
  ]
} as {
  required: [string, string][]
  optional: [string, string][]
}

export default modules
