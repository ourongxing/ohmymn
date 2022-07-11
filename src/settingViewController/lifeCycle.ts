import { MN } from "~/const"

export default {
  viewDidLoad() {
    self.tableView.allowsSelection = true
    self.view.layer.cornerRadius = 10
  },
  //Execute when each time it is opened
  viewWillAppear() {
    self.tableView.reloadData()
    self.tableView.backgroundColor = MN.app.defaultNotebookColor!
    MN.textColor =
      MN.app.currentTheme == "Gray" || MN.app.currentTheme == "Dark"
        ? UIColor.whiteColor()
        : UIColor.blackColor()
  }
}
