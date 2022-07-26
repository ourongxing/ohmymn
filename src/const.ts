import { OSType } from "~/typings/enum"
import mnaddon from "../mnaddon.json"

export const MN = {
  textColor: UIColor.blackColor(),
  mainPath: "",
  studyController: () =>
    Application.sharedInstance().studyController(self.window),
  isMac: Application.sharedInstance().osType == OSType.macOS,
  app: Application.sharedInstance(),
  db: Database.sharedInstance(),
  isZH: NSLocale.preferredLanguages()?.[0].startsWith("zh")
}

export const Addon = {
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  key: mnaddon.addonid.split(".")[2],
  globalProfileKey: "ohmymn_profile_global_v4",
  docProfileKey: "ohmymn_profile_doc_v4",
  notebookProfileKey: "ohmymn_profile_notebook_v4"
}
