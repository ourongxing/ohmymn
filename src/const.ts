import { osType, studyMode } from "types/MarginNote"
import mnaddon from "../mnaddon.json"

class MNCore {
  textColor!: UIColor
  mainPath!: string
  studyController = () =>
    Application.sharedInstance().studyController(self.window)
  isMac = Application.sharedInstance().osType == osType.macOS
  app = Application.sharedInstance()
  db = Database.sharedInstance()
}

export const Addon = {
  signed: false,
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  key: mnaddon.addonid.split(".")[2],
  link: "https://busiyi.notion.site/busiyi/ohmymn-wiki-74ac16d09d17420391b8ffb0dd8cab01",
  profileKey: "marginnote_ohmymn_profile_global_v300",
  docProfileKey: "marginnote_ohmymn_profile_doc_v300"
}

export const MN = new MNCore()
