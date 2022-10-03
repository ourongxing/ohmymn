import { OSType } from "~/enum"

function getVersion() {
  return "3.7.19"
}

const themeColor = {
  Gray: UIColor.colorWithHexString("#414141"),
  Default: UIColor.colorWithHexString("#FFFFFF"),
  Dark: UIColor.colorWithHexString("#000000"),
  Green: UIColor.colorWithHexString("#E9FBC7"),
  Sepia: UIColor.colorWithHexString("#F5EFDC")
}
export const MN = {
  studyController: () =>
    Application.sharedInstance().studyController(self.window),
  isMac: Application.sharedInstance().osType == OSType.macOS,
  isZH: NSLocale.preferredLanguages()?.[0].startsWith("zh"),
  // isZH: true,
  app: Application.sharedInstance(),
  db: Database.sharedInstance(),
  version: getVersion(),
  themeColor,
  currentTheme: () => themeColor[Application.sharedInstance().currentTheme!]
}
