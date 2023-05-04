#!/usr/bin/env node

import fs from "fs-extra"
import path from "path"
import minimist from "minimist"
import prompts from "prompts"
import { green, red, reset } from "kolorist"

type ColorFunc = (str: string | number) => string

type Option = {
  name: string
  display: string
  color?: ColorFunc
}

const cwd = process.cwd()
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })

const templates: Option[] = [
  {
    name: "base",
    display: "Base"
  },
  {
    name: "panel",
    display: "Base+Panel"
  },
  {
    name: "profile",
    display: "Base+Panel+Profile"
  }
]

const defaultTargetDir = "ohmymn-template"
async function init() {
  const argTargetDir = argv._[0]
  const argTemplate = argv.template || argv.t
  let targetDir = argTargetDir || defaultTargetDir
  let result: prompts.Answers<"projectName" | "overwrite" | "template">

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: targetDir,
          onState: state => {
            targetDir = state.value.trim() || defaultTargetDir
          }
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }
            return null
          },
          name: "overwriteChecker"
        },
        {
          type:
            argTemplate && templates.find(k => k.name === argTemplate)
              ? null
              : "select",
          name: "template",
          message: reset("Select a template:"),
          initial: 0,
          choices: templates.map(k => {
            return {
              title: k.color
                ? k.color(k.display || k.name)
                : k.display || k.name,
              value: k.name
            }
          })
        }
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
  const { overwrite, template } = result
  const root = path.join(cwd, targetDir)
  if (overwrite) {
    await fs.remove(targetDir)
  }

  const templateDir = path.resolve(
    __dirname,
    "../templates",
    template || argTemplate
  )

  await fs.copy(templateDir, root)
  console.log()
  console.log("Done. Now Run:")
  console.log()
  console.log(red(`> cd ${targetDir} && pnpm i && code .`))
  console.log()
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0
}

init().catch(r => {
  console.error(r)
})
