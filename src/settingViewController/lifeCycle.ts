import { MN } from "~/const"

const viewDidLoad = () => {
  self.tableView.allowsSelection = true
  self.view.layer.cornerRadius = 10
}

//Execute when each time it is opened
const viewWillAppear = () => {
  self.tableView.reloadData()
  self.tableView.backgroundColor = MN.app.defaultNotebookColor!
  MN.textColor =
    MN.app.currentTheme == "Gray" ? UIColor.whiteColor() : UIColor.blackColor()
}

export default {
  viewDidLoad,
  viewWillAppear
}
