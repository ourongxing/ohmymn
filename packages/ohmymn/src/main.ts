import { Addon } from "~/addon"
import JSExtension from "./jsExtension"

JSB.newAddon = path => {
  Addon.path = path
  return JSExtension
}
