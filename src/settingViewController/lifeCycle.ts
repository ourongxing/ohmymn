import { log } from "utils/public"

const viewDidLoad = () => {
    // 允许被选中，如果不加有一定机率无法触发选中 delegate
    self.tableView.allowsSelection = true
    // 圆角
    self.view.layer.cornerRadius = 10
    // 修改背景颜色，貌似 iPad 上不支持修改，暗黑模式麻烦，不想搞
    const theme = Application.sharedInstance().currentTheme!

    if (["Sepia", "Green"].includes(theme)) {
        self.tableView.backgroundView = null;
        self.tableView.opaque = false;
        switch (theme) {
            case "Sepia":
                self.tableView.backgroundColor = UIColor.colorWithHexString("#f6efdd")
                break
            case "Green":
                self.tableView.backgroundColor = UIColor.colorWithHexString("#eafac9")
        }
    }
}


// 每次打开都会执行
const viewWillAppear = () => {
    self.tableView.reloadData()
}

export default {
    viewDidLoad,
    viewWillAppear
}