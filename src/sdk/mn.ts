import { OSType } from "~/typings/enum"

export const MN = {
  studyController: () =>
    Application.sharedInstance().studyController(self.window),
  isMac: Application.sharedInstance().osType == OSType.macOS,
  // isZH: NSLocale.preferredLanguages()?.[0].startsWith("zh"),
  isZH: true,
  app: Application.sharedInstance(),
  db: Database.sharedInstance(),
  themeColor: {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
}
