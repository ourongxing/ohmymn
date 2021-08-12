function log(text){
  JSB.log("MNLOG %@", text)
}
const SettingViewController = JSB.defineClass('SettingViewController : UITableViewController', {
  viewDidLoad: function () {
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

    self.allSettings = [
      {
        addonName: 'OhMyMN',
        addonSetting: [
          {
            type: 'display',
            label: 'Github 投票征集新的需求\nMade By @ourongxing（点击跳转）'
          }, {
            type: 'switch',
            label: '面板置于右侧',
            key: 'rightMode',
          }, {
            type: 'switch',
            label: '双击打开面板',
            key: 'doubleClick',
          },
        ]
      },
      {
        addonName: 'Shortcuts',
        addonSetting: [
          {
            type: 'display',
            label: '请注意，以下功能均为选中卡片后点击操作\n使用方法点我查看，与后续板块相呼应'
          }, {
            type: 'switch',
            label: '点击后自动关闭面板',
            key: 'clickHidden',
          }, {
            type: 'button',
            label: '序列化摘录',
            key: 'listChecked',
            origin: 'AutoList'
          }, {
            type: 'button',
            label: '补全单词词形', key: 'completeChecked',
            origin: 'AutoComplete'
          }, {
            type: 'button',
            label: '填充单词解释',
            key: 'fillChecked',
            origin: 'AutoComplete'
          }, {
            type: 'button',
            label: '规范摘录和标题',
            key: 'standardizeChecked',
            origin: 'AutoStandardize'
          }, {
            type: 'button',
            label: '切换摘录或标题',
            key: 'switchTitleorExcerpt',
            origin: 'AnotherAutoTitle'
          }, {
            type: 'buttonWithInput',
            label: '批量重命名标题',
            key: 'renameChecked',
            help: '%s 代表原标题',
          }, {
            type: 'buttonWithInput',
            label: '批量替换摘录文字',
            key: 'replaceChecked',
            help: `参考 JS 的 replace 语法\n格式：("匹配","替换");()`,
            origin: 'AutoReplace'
          }, {
            type: 'buttonWithInput',
            label: '改变所有摘录颜色',
            key: 'changeColorChecked',
            help: '输入颜色索引，也就是顺序，从 1 开始',
          }, {
            type: 'buttonWithInput',
            label: '改变所有摘录填充',
            help: '输入填充索引，也就是顺序，从 1 开始',
            key: 'changeFillChecked',
          },
        ]
      },
      {
        addonName: 'AutoStandardize',
        addonSetting: [
          {
            type: 'display',
            label: '按照排版规范来优化摘录以及标题'
          }, {
            type: 'switch',
            label: '摘录时自动执行',
            key: 'on',
          }, {
            type: 'switch',
            label: '默认使用中文标点符号',
            key: 'defaultChinese',
          }, {
            type: 'switch',
            label: '首字母大写',
            key: 'firstCapitalize',
          },
        ]
      },
      {
        addonName: 'AutoComplete',
        addonSetting: [
          {
            type: 'display',
            label: '补全单词词形，只支持动词和名词\n需要配合AnotherAutoTitle 使用'
          }, {
            type: 'switch',
            label: '摘录时自动执行',
            key: 'on',
          }, {
            type: 'display',
            label: '覆盖小学到托福词汇'
          }, {
            type: 'switch',
            label: '填充单词解释',
            key: 'fillExplanation',
          },
        ]
      },
      {
        addonName: 'AnotherAutoTitle',
        addonSetting: [
          {
            type: 'display',
            label: '更强大的自动转换标题插件'
          }, {
            type: 'switch',
            label: '摘录时自动执行',
            key: 'on',
          }, {
            type: 'display',
            label: '以下情况会在摘录时自动转换为标题'
          }, {
            type: 'switch',
            label: '不含有点号',
            key: 'noPunctuation',
          }, {
            type: 'input',
            label: '字数不超过',
            key: 'wordCount',
            content: '10'
          }, {
            type: 'display',
            label: '自定义正则表达式，无视上述规则\n格式：(/正则/);(/正则/)'
          }, {
            type: 'lineInput',
            key: 'customInput',
          }
        ]
      },
      {
        addonName: 'AutoReplace',
        addonSetting: [
          {
            type: 'display',
            label: '使用正则匹配替换摘录中的某些错误'
          }, {
            type: 'switch',
            key: 'on',
            label: '摘录时自动执行',
          }, {
            type: 'display',
            label: `参考 JS 的 replace 语法\n格式：("匹配","替换");();`
          }, {
            type: 'lineInput',
            key: 'customInput',
          },
        ]
      },
      {
        addonName: 'AutoList',
        addonSetting: [
          {
            type: 'display',
            label: '针对序列文本，自动换行以及补充序号或分号'
          }, {
            type: 'switch',
            key: 'on',
            label: '摘录时自动执行',
          },
        ]
      },
    ]

    // 如果设置了默认状态的话，貌似不允许修改
    const tmp_config = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_ohmymn_config')
    if (tmp_config){
      const config = JSON.parse(tmp_config)
      for (addon of self.allSettings) {
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
    return self.allSettings.length
  },

  tableViewNumberOfRowsInSection: function (tableView, section) {
    return self.allSettings[section].addonSetting.length
  },

  tableViewTitleForHeaderInSection: function (tableView, section) {
    return self.allSettings[section].addonName
  },

  tableViewHeightForRowAtIndexPath: function (tableView, indexPath) {
    setting = self.allSettings[indexPath.section].addonSetting[indexPath.row]
    if (setting.type == 'display'){
      let num = setting.label.length - setting.label.replace(/[\r\n]/g, '').length
      return 30 + num * 15
    }
    else return 40
  },

  tableViewCellForRowAtIndexPath: function (tableView, indexPath) {
    // 渲染一组的不同行
    setting = self.allSettings[indexPath.section].addonSetting[indexPath.row]
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
    const addon = self.allSettings[indexPath.section]
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
        NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('ButtonClick', self, {origin: setting.origin ? setting.origin : "", key: setting.key, content: tmp})
      })
    }
    if (setting.type == 'button'){
      NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('ButtonClick', self, {origin: setting.origin ? setting.origin : "", key: setting.key, content: ""})
    }
  },

  textFieldShouldReturn: function(sender) {
    sender.resignFirstResponder()
    const addon = self.allSettings[(sender.tag - 999 - (sender.tag - 999) % 100)/100]
    const setting = addon.addonSetting[(sender.tag - 999) % 100]
    setting.content = sender.text
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('InputOver', self, {name: addon.addonName, key: setting.key, content: sender.text})
    return true
  },

  switchChange: function (sender) {
    const addon = self.allSettings[(sender.tag - 999 - (sender.tag - 999) % 100)/100]
    const setting = addon.addonSetting[(sender.tag - 999) % 100]
    setting.status = sender.on
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('SwitchChange', self, {name: addon.addonName, key: setting.key, status: sender.on})
  },
})
