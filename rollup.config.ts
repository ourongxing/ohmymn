import os from "os"
import typescript from "rollup-plugin-typescript2"
import json from "@rollup/plugin-json"
import { defineConfig } from "rollup"
import mnaddon from "./mnaddon.json"
import AutoImport from "unplugin-auto-import/rollup"
import copy from "rollup-plugin-copy"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"

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
  watch: {
    exclude: "../node_modules/**"
  },
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
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
