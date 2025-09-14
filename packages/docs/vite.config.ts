import { defineConfig, type Plugin } from "vite"
import Unocss from "unocss/vite"
import { presetAttributify, presetIcons, presetUno } from "unocss"
import { resolve } from "pathe"
import fs from "fs"

export default defineConfig({
  optimizeDeps: {
    exclude: ["vitepress"]
  },
  plugins: [
    Unocss({
      shortcuts: [
        [
          "btn",
          "px-4 py-1 rounded inline-flex justify-center gap-2 text-white leading-30px children:mya !no-underline cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
        ]
      ],
      presets: [
        presetUno({
          dark: "media"
        }),
        presetAttributify(),
        presetIcons({
          scale: 1.2
        })
      ]
    }),
    IncludesPlugin()
  ]
})

function IncludesPlugin(): Plugin {
  return {
    name: "include-plugin",
    enforce: "pre",
    transform(code, id) {
      let changed = false
      code = code.replace(/\[@@include\]\((.*?)\)/, (_, url) => {
        changed = true
        const full = resolve(id, url)
        return fs.readFileSync(full, "utf-8")
      })
      if (changed) return code
    }
  }
}
