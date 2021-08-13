// mainPath 是传入的插件文件夹位置
JSB.newAddon = function(mainPath){
  JSB.require('/src/settingViewController')
  JSB.require('/src/dictImporter')
  JSB.require('/src/panguIniter')
  JSB.require('/src/utils')
  JSB.require('/src/actions')
  // MAC 上由于不支持 OCR PRO ，就不存在自动矫正的问题，但是在 iPad 上，会出现自动校正，此时我们需要等待矫正完成再修改。
  const newAddonClass = JSB.defineClass('OhMyMN : JSExtension',{
    sceneWillConnect: function() {
      // 导入词典
      self.tmp = {
        show: false,
        dict: DictImporter.new().init()
      }
      self.utils = Utils.new().init(PanguIniter.new().init())
      self.action = Actions.new().init()

      // 初始化配置
      self.config = {
        OhMyMN: {},
        Shortcuts: {},
        AutoStandardize: {},
        AutoComplete: {},
        AutoList: {},
        AutoReplace: {},
        AnotherAutoTitle: {},
      }
      const tmp_config = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_ohmymn_config')
      if (tmp_config) {
        const store_config = JSON.parse(tmp_config)
        for (key in store_config) {
          self.config[key] = store_config[key]
        }
      }

      self.settingViewController = SettingViewController.new()
      self.settingViewController.mainPath = mainPath
      self.studyController = Application.sharedInstance().studyController(self.window)
      self.layoutViewController = function(rightMode){
        let frame = self.studyController.view.bounds
        // let width = frame.width > 300?(300 + (frame.width - 300)/2):300
        let width = 300
        if (rightMode) {
          self.settingViewController.view.frame = {x:frame.width-width-50,y:110,width: width,height: 450}
        } else {
          self.settingViewController.view.frame = {x:50,y:110,width: width,height: 450}
        }
      }
    },
    sceneDidDisconnect: function() {
      // 保存配置信息
      NSUserDefaults.standardUserDefaults().setObjectForKey(JSON.stringify(self.config), 'marginnote_ohmymn_config')
    },
    sceneWillResignActive: function() {
    },
    sceneDidBecomeActive: function() {
    },
    notebookWillOpen: function(notebookid) {
      self.tmp.notebookid = notebookid
      // 插件面板自定义响应事件
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onButtonClick:', 'ButtonClick')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onSwitchChange:', 'SwitchChange')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onInputOver:', 'InputOver')
      // 创建摘录以及修改摘录
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ProcessNewExcerpt')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ChangeExcerptRange')
      // MindMapSelChanged, return syncIndex 不知道是什么
      // NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'test:','')
    },
    notebookWillClose: function(notebookid) {
      // 保存配置信息
      NSUserDefaults.standardUserDefaults().setObjectForKey(JSON.stringify(self.config),'marginnote_ohmymn_config')
      NSNotificationCenter.defaultCenter().removeObserverName(self, 'ButtonClick')
      NSNotificationCenter.defaultCenter().removeObserverName(self, 'SwitchChange')
      NSNotificationCenter.defaultCenter().removeObserverName(self, 'InputOver')
      NSNotificationCenter.defaultCenter().removeObserverName(self,'ProcessNewExcerpt')
      NSNotificationCenter.defaultCenter().removeObserverName(self,'ChangeExcerptRange')
    },
    documentDidOpen: function(docmd5) {
    },
    documentWillClose: function(docmd5) {
    },
    controllerWillLayoutSubviews: function(controller) {
      //在这里添加窗口位置布局的代码
      if(controller == self.studyController){
        self.layoutViewController(self.config.OhMyMN.rightMode)
      }
    },
    queryAddonCommandStatus: function() {
      // 仅在学习模式下
      if(self.studyController.studyMode < 3)
        return {
          image: 'ohmymn.png',
          object: self,
          selector: 'toggleOhMyMN:',
          checked: (self.tmp.show ? true : false)
        }
      return null
    },

    // 创建摘录以及修改摘录
    onProcessExcerptText: function(sender) {
      // 不处理其他窗口发出的通知
      if(!Application.sharedInstance().checkNotifySenderInWindow(sender,self.window)) return
      // 通过 groupNoteId 是否是属于评论的摘录
      const note = Database.sharedInstance().getNoteById(sender.userInfo.noteid)
      let title = self.utils.getNoteTitle(note)
      let text = self.utils.getNoteText(note)
      // 先对摘录进行处理
      if(text) {
        if (self.config.AutoStandardize.on)
          text = self.utils.standardizeText(text)
      } else return

      let flag = self.utils.checkTitle(self.config.AnotherAutoTitle, text)
      // 表明是属于卡片真正的摘录，后面的摘录都是属于评论了, groupNoteId 是当前卡片的 id
      UndoManager.sharedInstance().undoGrouping('ohmymn', self.tmp.notebookId, () => {
        if (!note.groupNoteId) {
          if(title.length > 2 && (text.startsWith(title) || text.endsWith(title))) {
            // 如果标题已经存在，说明是在修改标题
            // 如果满足转换成标题的条件，修改的时候可以不管标题是否满足条件
            // 不光是要标题存在，如果标题是后加的，此时如果修改摘录，也会转成标题
            // 此时要处理一下，标题是摘录的开头或结尾
            flag = true
          }
          if(self.config.AnotherAutoTitle.on && flag){
            note.noteTitle = text
            note.excerptText = ""
          } else note.excerptText = text
        } else {
          // 满足标题条件的评论摘录自动合并标题，并删除该摘录
          if (self.config.AnotherAutoTitle.mergeTitle && flag) {
            const node = Database.sharedInstance().getNoteById(note.groupNoteId)
            let nodeTitle = self.utils.getNoteTitle(node)
            if (nodeTitle) {
              node.noteTitle = nodeTitle + "；" + text
            } else {
              node.noteTitle = text
            }
            const index = self.utils.getCommentIndex(node, note)
            // 找到 index ，删除它
            if ( index != -1) node.removeCommentByIndex(index)
          } else note.excerptText = text
        }
        Database.sharedInstance().setNotebookSyncDirty(self.tmp.notebookId)
      })
      self.utils.refreshNotebook(self)
    },

    onButtonClick: function(sender) {
      // 点击后关闭面板
      if (self.config.Shortcuts.clickHidden) {
        self.settingViewController.view.removeFromSuperview()
        self.tmp.show = false
        self.studyController.refreshAddonCommands()
      }
      const nodes = utils.selectNodes(self)
      const key = sender.userInfo.key
      const input = sender.userInfo.content
      UndoManager.sharedInstance().undoGrouping('ohmymn', self.tmp.notebookId, () => {
        if (nodes.length) {
          self.action[key](self, self.utils, {input, nodes})
          Database.sharedInstance().setNotebookSyncDirty(self.tmp.notebookId)
        }
      })
    },

    onInputOver: function(sender){
      const input = sender.userInfo.content
      const key = sender.userInfo.key
      const addonName = sender.userInfo.name
      self.config[addonName][key] = input
      self.utils.showHUD(self, "输入已保存", 1)
    },

    onSwitchChange: function(sender){
      const key = sender.userInfo.key
      const addonName = sender.userInfo.name
      const status = sender.userInfo.status
      self.config[addonName][key] = status
      if(key == 'rightMode') {
        self.layoutViewController(status)
      }
    },

    toggleOhMyMN: function(sender) {
      if(self.tmp.show) {
        self.settingViewController.view.removeFromSuperview()
        self.tmp.show = false
        self.studyController.refreshAddonCommands()
      } else {
        let flag = true
        if (self.config.OhMyMN.doubleClick) {
          const timestamp = new Date().getTime()
          // 如果不是第一次点击并且和上次点击不超过 500 ms
          if(self.tmp.lastclick && timestamp - self.tmp.lastclick < 500){ }
          else {
            self.tmp.lastclick = timestamp
            flag = false
          }
        }
        if (flag) {
          // 开启插件时自动变为一半脑图一半书
          if (self.studyController.docMapSplitMode == 2) {
            self.studyController.docMapSplitMode = 1
            self.utils.showHUD("OhMyMN 与脑图更配喔", 1)
          }
          self.studyController.view.addSubview(self.settingViewController.view)
          self.layoutViewController(self.config.OhMyMN.rightMode)
          self.tmp.show = true
          // 开启面板时，若键盘处于开启状态，关闭键盘
          NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){
            self.studyController.becomeFirstResponder()
          })
          self.studyController.refreshAddonCommands()
        }
      }
    }
  },
    {
      addonDidConnect: function() {
      }, addonWillDisconnect: function() {
      }, applicationWillEnterForeground: function() {
      }, applicationDidEnterBackground: function() {
      }, applicationDidReceiveLocalNotification: function(notify) {
      },
    })
  return newAddonClass
}
