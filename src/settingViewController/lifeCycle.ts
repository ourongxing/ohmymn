import { Addon } from "~/addon"
import { MN } from "marginnote"
export default {
  viewDidLoad() {
    self.tableView.allowsSelection = true
    self.view.layer.cornerRadius = 10
    self.view.layer.borderWidth = 2
  },
  //Execute when each time it is opened
  viewWillAppear() {
    self.expandSections = new Set()
    self.tableView.reloadData()
    if (MN.isMac) {
      self.tableView.backgroundColor = MN.currentThemeColor
      Addon.textColor =
        MN.app.currentTheme == "Gray" || MN.app.currentTheme == "Dark"
          ? UIColor.whiteColor()
          : UIColor.blackColor()
    }
    self.view.layer.borderColor = Addon.buttonColor
  },
  viewWillDisappear() {
    self.tableView.setContentOffsetAnimated({ x: 0, y: 0 }, false)
  }
}
