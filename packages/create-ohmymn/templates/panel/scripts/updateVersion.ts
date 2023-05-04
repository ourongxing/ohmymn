import { existsSync } from "fs-extra"
import { readFile, writeFile } from "fs-extra"
import { version } from "../package.json"

async function main() {
  if (existsSync("README.md")) {
    const content = await readFile("README.md", "utf8")
    await writeFile(
      "README.md",
      content.replace(/version-v.+?-yellow/, `version-v${version}-yellow`)
    )
  }
}

main()
