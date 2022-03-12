import { osType } from "typings/enum"
import mnaddon from "../mnaddon.json"

class MNCore {
  textColor!: UIColor
  mainPath!: string
  studyController = () =>
    Application.sharedInstance().studyController(self.window)
  isMac = Application.sharedInstance().osType == osType.macOS
  app = Application.sharedInstance()
  db = Database.sharedInstance()
  isZH =
    NSLocale.preferredLanguages().length &&
    NSLocale.preferredLanguages()[0].startsWith("zh")
}

export const Addon = {
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  key: mnaddon.addonid.split(".")[2],
  profileKey: "marginnote_ohmymn_profile_global_v300",
  docProfileKey: "marginnote_ohmymn_profile_doc_v300"
}

export const MN = new MNCore()
