import { build } from "@kossnocorp/estrella"
import type { Plugin } from "esbuild"
import manifest from "./manifest"
import copy from "esbuild-plugin-mxn-copy"
import autoImport from "unplugin-auto-import/esbuild"
import { homedir } from "os"
import fs from "fs-extra"
import { exec } from "child_process"

const isProd = process.env.NODE_ENV === "production"

const bannerText = `
/*
THIS IS A GENERATED/BUNDLED FILE BY ESBuild

MIT License
Copyright (c) 2021 Ou Rongxing

If you want to view the source code, please visit the github repository.
Github: ${manifest.github}

Welcome to contribute to this project!
*/

try {
`

const footerText = `
} catch (e) {
  Application.sharedInstance().alert("${manifest.title}-"+String(e))
}
`

const outDir = isProd
  ? "./dist/"
  : process.env.MN === "4"
  ? homedir() +
    `/Library/Containers/QReader.MarginStudy.easy/Data/Library/MarginNote Extensions/marginnote.extension.${manifest.key}/`
  : homedir() +
    `/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/marginnote.extension.${manifest.key}/`

function clear(): Plugin {
  return {
    name: "Clear",
    setup(build) {
      build.onStart(() => {
        if (fs.existsSync(outDir)) {
          fs.rmSync(outDir, { recursive: true })
        }
      })
    }
  }
}

function zip(): Plugin {
  return {
    name: "Zip",
    setup(build) {
      build.onEnd(() => {
        if (isProd && fs.existsSync(outDir)) {
          const fileName = `${manifest.key} v${manifest.version}`.replace(
            /[ .]/g,
            "_"
          )
          exec(`cd ${outDir} && zip -qr ${fileName}.unsigned.mnaddon *`)
          console.log(`Generated at ${outDir}${fileName}.unsigned.mnaddon`)
        }
      })
    }
  }
}

function genManifest(): Plugin {
  return {
    name: "GenManifest",
    setup(build) {
      build.onEnd(() => {
        const mnaddon = {
          addonid: `marginnote.extension.${manifest.key}`,
          author: manifest.author,
          title: manifest.title,
          version: manifest.version,
          marginnote_version_min: manifest.minMarginNoteVersion,
          cert_key: ""
        }
        if (fs.existsSync(outDir))
          fs.writeJSONSync(outDir + "mnaddon.json", mnaddon, { spaces: 2 })
      })
    }
  }
}

const plugins: Plugin[] = [
  clear(),
  autoImport({
    imports: [
      {
        marginnote: ["MN"]
      }
    ],
    dts: false
  }),
  manifest.files?.length &&
    copy({
      copy: manifest.files.map(k => ({
        from: k,
        to: outDir
      }))
    }),
  genManifest(),
  isProd && zip()
].filter(k => k)

build({
  entry: "src/main.ts",
  tslint: !isProd,
  outfile: outDir + "main.js",
  splitting: false,
  sourcemap: false,
  clear: true,
  watch: !isProd,
  minify: isProd,
  banner: {
    js: bannerText
  },
  footer: {
    js: footerText
  },
  pure: ["MN.log", "MN.error"],
  bundle: true,
  target: "safari13",
  plugins
})
