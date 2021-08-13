const SettingViewController = JSB.defineClass('SettingViewController : UITableViewController', {
  viewDidLoad: function () {
    // 这样才能正确读取到
    JSB.require(self.mainPath + '/src/dataSource')

    // 允许被选中，如果不加有一定机率无法触发选中 delegate
    self.tableView.allowsSelection = true
    // 圆角
    self.view.layer.cornerRadius = 10

    self.tmp = {
      currentTheme: Application.sharedInstance().currentTheme,
      osType: Application.sharedInstance().osType,
      // 暂不支持黑色，麻烦，我也不喜欢
      themes: {
        Sepia: "#f6efdd",
        Green: "#eafac9"
      }
    }

    // 修改背景颜色，貌似 iPad 上不支持修改
    if(self.tmp.osType == 2 && self.tmp.currentTheme != "Default") {
      const tmpView = new UIView(self.tableView.bounds)
      tmpView.backgroundColor = UIColor.colorWithHexString(self.tmp.themes[self.tmp.currentTheme])
      self.tableView.backgroundView = tmpView
    }

    self.controller = {
      switch: function (status = false) {
        const frame = { x: 0, y: 5, width: 50, height: 30 }
        const view = new UISwitch(frame)
        view.addTargetActionForControlEvents(self, 'switchChange:', 1 << 12)
        view.backgroundColor = UIColor.clearColor()
        view.on = status
        return view
      },
      input: function (text = "") {
        const frame = { x: 0, y: 9, width: 100, height: 30 }
        if (self.tmp.osType == 0) frame.y = 5
        const view = new UITextField(frame)
        view.font = UIFont.systemFontOfSize(18)
        // 把协议和控制器连接
        view.delegate = self
        view.text = text
        view.textAlignment = 0
        view.autoresizingMask = 1 << 1 | 1 << 5
        return view
      },
      lineInput: function (text = "") {
        const frame = { x: 40, y: 9, width: 250, height: 30 }
        if (self.tmp.osType == 0) frame.y = 5
        const view = new UITextField(frame)
        view.font = UIFont.systemFontOfSize(15)
        view.delegate = self
        view.textAlignment = 0
        view.autoresizingMask = 1 << 1 | 1 << 5
        view.text = text
        return view
      }
    }

    self.dataSource = DataSource.new().init()

    // 如果设置了默认状态的话，貌似不允许修改
    const tmp_config = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_ohmymn_config')
    if (tmp_config){
      const config = JSON.parse(tmp_config)
      for (addon of self.dataSource) {
        const addonName = addon.addonName
        for (setting of addon.addonSetting){
          if (setting.type == 'switch') {
            if (config[addonName][setting.key]) {
              setting.status = config[addonName][setting.key]
            }
          }
          if (setting.type == 'input' || setting.type == 'lineInput') {
            if (config[addonName][setting.key]) {
              setting.content = config[addonName][setting.key]
            }
          }
        }
      }
    }
  },

  numberOfSectionsInTableView: function (tableView) {
    return self.dataSource.length
  },

  tableViewNumberOfRowsInSection: function (tableView, section) {
    return self.dataSource[section].addonSetting.length
  },

  tableViewTitleForHeaderInSection: function (tableView, section) {
    return self.dataSource[section].addonName
  },

  tableViewHeightForRowAtIndexPath: function (tableView, indexPath) {
    setting = self.dataSource[indexPath.section].addonSetting[indexPath.row]
    if (setting.type == 'display'){
      let num = setting.label.length - setting.label.replace(/[\r\n]/g, '').length
      return 30 + num * 15
    }
    else return 40
  },

  tableViewCellForRowAtIndexPath: function (tableView, indexPath) {
    // 渲染一组的不同行
    setting = self.dataSource[indexPath.section].addonSetting[indexPath.row]
    if (setting.type == 'display') {
      let cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'DisplayCellID')
      cell.selectionStyle = 0
      cell.textLabel.opaque = false
      cell.textLabel.textAlignment = 0
      cell.textLabel.lineBreakMode = 0
      cell.textLabel.numberOfLines = 0
      cell.textLabel.textColor = UIColor.grayColor()
      cell.textLabel.font = UIFont.systemFontOfSize(12)
      cell.textLabel.text = setting.label
      return cell
    } else if (setting.type == 'button' || setting.type == 'buttonWithInput') {
      let cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'ButtonCellID')
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.selectionStyle = 0
      cell.textLabel.text = setting.label
      return cell
    } else if (setting.type == 'input') {
      let cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'InputCellID')
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.selectionStyle = 0
      cell.textLabel.text = setting.label
      let view = null
      if (setting.content) view = self.controller.input(setting.content)
      else view = self.controller.input()
      let newFrame = view.frame
      newFrame.x = cell.contentView.frame.width - newFrame.width - 10
      view.frame = newFrame
      view.autoresizingMask = 1 << 0
      // 传入位置，不要直接传入 indexPath，以及设置 indexPath 属性
      // 唯一值，建议加一个较大数
      view.tag = indexPath.section * 100 + indexPath.row + 999
      cell.contentView.addSubview(view)
      return cell
    } else if (setting.type == 'lineInput') {
      let cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'LineInputCellID')
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.selectionStyle = 0
      let view = null
      if (setting.content) view = self.controller.lineInput(setting.content)
      else view = self.controller.lineInput()
      view.autoresizingMask = 1 << 0
      view.tag = indexPath.section * 100 + indexPath.row + 999
      cell.contentView.addSubview(view)
      return cell
    } else {
      let cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'SwitchCellID')
      cell.selectionStyle = 0
      cell.textLabel.text = setting.label
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      let view = null
      if (setting.status) view = self.controller.switch(setting.status)
      else view = self.controller.switch()
      let newFrame = view.frame
      newFrame.x = cell.contentView.frame.width - newFrame.width - 10
      view.frame = newFrame
      view.autoresizingMask = 1 << 0
      view.tag = indexPath.section * 100 + indexPath.row + 999
      cell.contentView.addSubview(view)
      return cell
    }
  },

  tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
    const addon = self.dataSource[indexPath.section]
    const setting = addon.addonSetting[indexPath.row]
    if(indexPath.section == 0 && indexPath.row == 0){
      const encodedUrl = encodeURI("https://github.com/ourongxing")
      Application.sharedInstance().openURL(NSURL.URLWithString(encodedUrl))
    } else if(indexPath.section == 1 && indexPath.row == 0){
      const encodedUrl = encodeURI("https://github.com/ourongxing")
      Application.sharedInstance().openURL(NSURL.URLWithString(encodedUrl))
    }
    if (setting.type == 'buttonWithInput') {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(setting.label, setting.help, 2, "确定",[], function(alert) {
        tmp = alert.textFieldAtIndex(0).text
        if (!tmp) tmp = ""
        NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('ButtonClick', self, {key: setting.key, content: tmp})
      })
    }
    if (setting.type == 'button'){
      NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('ButtonClick', self, {key: setting.key, content: ""})
    }
  },

  textFieldShouldReturn: function(sender) {
    sender.resignFirstResponder()
    const addon = self.dataSource[(sender.tag - 999 - (sender.tag - 999) % 100)/100]
    const setting = addon.addonSetting[(sender.tag - 999) % 100]
    setting.content = sender.text
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('InputOver', self, {name: addon.addonName, key: setting.key, content: sender.text})
    return true
  },

  switchChange: function (sender) {
    const addon = self.dataSource[(sender.tag - 999 - (sender.tag - 999) % 100)/100]
    const setting = addon.addonSetting[(sender.tag - 999) % 100]
    setting.status = sender.on
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('SwitchChange', self, {name: addon.addonName, key: setting.key, status: sender.on})
  },
})
