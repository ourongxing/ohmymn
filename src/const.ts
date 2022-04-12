import { osType } from "@/typings/enum"
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
  profileKey: mnaddon.profileKey,
  docProfileKey: mnaddon.docProfileKey
}

export const MN = new MNCore()
