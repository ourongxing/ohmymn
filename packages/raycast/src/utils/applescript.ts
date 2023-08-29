import { open } from "@raycast/api"
import { runAppleScript } from "run-applescript"

export async function isRunning(appName: string) {
  try {
    const script = `
    tell application "System Events"
      return (name of processes contains "${appName}")
    end tell
  `
    return (await runAppleScript(script)) === "true"
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function openShortCut(url: string) {
  open(url)
}
