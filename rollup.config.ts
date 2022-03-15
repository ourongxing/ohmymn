import os from "os"
import typescript from "rollup-plugin-typescript2"
import json from "@rollup/plugin-json"
import { defineConfig } from "rollup"
import mnaddon from "./mnaddon.json"
import AutoImport from "unplugin-auto-import/rollup"
import copy from "rollup-plugin-copy"

const dir =
  os.homedir() +
  `/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/${mnaddon.addonid}`

export default defineConfig({
  input: ["src/main.ts"],
  output: {
    dir,
    format: "iife",
    exports: "none",
    sourcemap: false
  },
  plugins: [
    typescript(),
    json(),
    AutoImport({
      imports: [
        {
          "utils/common": ["console"]
        }
      ],
      dts: false
    }),
    copy({
      copyOnce: true,
      targets: [
        {
          src: ["assets/logo.png", "mnaddon.json", "assets/icon"],
          dest: dir
        }
      ]
    })
  ]
})
