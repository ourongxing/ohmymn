import { OSType } from "~/typings/enum"
import mnaddon from "../mnaddon.json"

export const MN = {
  mainPath: "",
  studyController: () =>
    Application.sharedInstance().studyController(self.window),
  isMac: Application.sharedInstance().osType == OSType.macOS,
  app: Application.sharedInstance(),
  db: Database.sharedInstance(),
  // isZH: NSLocale.preferredLanguages()?.[0].startsWith("zh")
  isZH: true,
  colors: {
    Gray: "#414141",
    Default: "#FFFFFF",
    Dark: "#000000",
    Green: "#E9FBC7",
    Sepia: "#F5EFDC"
  }
}

export const Addon = {
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  key: mnaddon.addonid.split(".")[2],
  globalProfileKey: "ohmymn_profile_global_v4",
  docProfileKey: "ohmymn_profile_doc_v4",
  notebookProfileKey: "ohmymn_profile_notebook_v4",
  textColor: UIColor.blackColor(),
  borderColor: UIColor.colorWithHexString("#8A95A2"),
  buttonColor: UIColor.colorWithHexString("#8A95A2")
}
