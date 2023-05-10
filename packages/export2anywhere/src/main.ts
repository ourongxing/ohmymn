import { Addon } from "~/addon"
import JSExtension from "./JSExtension"

JSB.newAddon = path => {
  Addon.path = path
  return JSExtension
}
