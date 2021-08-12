JSB.newAddon = function(mainPath){
  JSB.require('settingViewController')
  JSB.require('panguIniter')
  const newAddonClass = JSB.defineClass('OhMyMN : JSExtension',{
    // 打开窗口时，也就是打开 MN，只加载一次，生命周期从这里开始
    sceneWillConnect: function() {
      self.utils = {
        log: function(text){
          JSB.log("MNLOG %@", text)
        },
        showHUD: function(text, sec = 2){
          Application.sharedInstance().showHUD(text, self.window, sec)
        },
        refreshNotebook: function(notebookid){
          NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange', self, { topicid: notebookid })
        },
        selectNodes: function(){
          const MindMapNodes = self.studyController.notebookController.mindmapView.selViewLst
          if(MindMapNodes) return MindMapNodes.map(item => item.note.note)
          else return []
        },
        excerptNotes: function(node){
          const notes = [node]
          // 包括作为评论的摘录
          const comments = node.comments
          for (comment of comments){
            if (comment.type == "LinkNote") notes.push(Database.sharedInstance().getNoteById(comment.noteid))
          }
          return notes
        },
        getNoteTitle: function(note) {
          // 预处理一下没有标题的情况
          if (note.noteTitle) return note.noteTitle
          else return ""
        },
        getNoteText: function(note) {
          // 排除掉图片摘录，防止获取到 OCR 结果
          if (!note.excerptPic) {
            if (note.excerptText) return note.excerptText
            else return ""
          } else return ""
        },
        pangu: PanguIniter.new().init()
      }
      self.tmp = {}
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

      self.SettingViewController = SettingViewController.new()
      self.studyController = Application.sharedInstance().studyController(self.window)
      self.layoutViewController = function(rightMode){
        let frame = self.studyController.view.bounds
        // let width = frame.width > 300?(300 + (frame.width - 300)/2):300
        let width = 300
        if (rightMode) {
          self.SettingViewController.view.frame = {x:frame.width-width-50,y:110,width: width,height: 450}
        } else {
          self.SettingViewController.view.frame = {x:50,y:110,width: width,height: 450}
        }
      }
      self.SettingViewController.mainPath = mainPath
      self.action = {
        listChecked: function(param){
          self.utils.log(param)
        },
        completeChecked: function(param){
          self.utils.log(param)
        },
        fillChecked: function(param){
          self.utils.log(param)
        },
        standardizeChecked: function(param){
          const nodes = self.utils.selectNodes()
          for(node of nodes) {
            const title = self.utils.getNoteTitle(node)
            if(title){
              node.noteTitle = self.utils.pangu.spacing(title)
            }
            const notes = self.utils.excerptNotes(node)
            for(note of notes) {
              const text = self.utils.getNoteText(note)
              if (text)  {
                note.excerptText = self.utils.pangu.spacing(text)
              }
            }
          }
          self.utils.refreshNotebook(self.notebookid)
        },
        switchTitleorExcerpt: function(param){
          const nodes = self.utils.selectNodes()
          for(note of nodes) {
            const title = self.utils.getNoteTitle(note)
            const text = self.utils.getNoteText(note)
            // 只允许存在一个
            if ((title || text) && !(title && text)) {
              note.noteTitle = text
              note.excerptText = title
            }
          }
          self.utils.refreshNotebook(self.notebookid)
        },
        renameChecked: function(param){
          self.utils.log(param)
        },
        changeFillChecked: function(param){
          // 使下标从 1 开始
          const index = Number(param.input)
          if (!isNaN(index) && index <= 4 && index > 0) {
            const nodes = self.utils.selectNodes()
            for(node of nodes) {
              const notes = self.utils.excerptNotes(node)
              for(note of notes) {
                note.fillIndex = index - 2
              }
            }
            self.utils.refreshNotebook(self.notebookid)
          } else {
            self.utils.showHUD("输入不正确", 1)
          }
        },
        changeColorChecked: function(param){
          const index = Number(param.input)
          if (!isNaN(index) && index <= 16 && index > 0) {
            const nodes = self.utils.selectNodes()
            for(node of nodes) {
              const notes = self.utils.excerptNotes(node)
              for(note of notes) {
                note.colorIndex = index - 1
              }
            }
            self.utils.refreshNotebook(self.notebookid)
          } else {
            self.utils.showHUD("输入不正确", 1)
          }
        },
        replaceChecked: function(param){
          self.utils.log(param)
        }
      }
    },
    sceneDidDisconnect: function() {
    },
    sceneWillResignActive: function() {
    },
    sceneDidBecomeActive: function() {
    },
    notebookWillOpen: function(notebookid) {
      self.notebookid = notebookid
      // 插件面板自定义响应事件
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onButtonClick:', 'ButtonClick')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onSwitchChange:', 'SwitchChange')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onInputOver:', 'InputOver')
      // 创建摘录以及修改摘录
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ProcessNewExcerpt')
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ChangeExcerptRange')
      // 等待 0.2s 再打开面板
      NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){
        self.show = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_ohmymn_show')
        if(self.show){
          self.studyController.view.addSubview(self.SettingViewController.view)
          self.layoutViewController(self.config.OhMyMN.rightMode)
          self.studyController.refreshAddonCommands()
        }
      })
      myUserDefaults = NSUserDefaults.standardUserDefaults()
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
      return {
        image: 'ohmymn.png',
        object: self,
        selector: 'toggleOhMyMN:',
        checked: (self.show ? true : false)
      }
    },

    // 创建摘录以及修改摘录
    onProcessExcerptText: function(sender) {
      // 通过 groupNoteId 是否是属于评论的摘录，当然前提是卡片的摘录存在的情况下
      const note = Database.sharedInstance().getNoteById(sender.userInfo.noteid)
      let title = self.utils.getNoteTitle(note)
      let text = self.utils.getNoteText(note)
      self.utils.log(text)
    },

    onButtonClick: function(sender) {
      const key = sender.userInfo.key
      const input = sender.userInfo.content
      const origin = sender.userInfo.origin
      if (self.config.Shortcuts.clickHidden) {
        self.SettingViewController.view.removeFromSuperview()
        NSUserDefaults.standardUserDefaults().setObjectForKey(false,'marginnote_ohmymn_show')
        self.show = false
        self.studyController.refreshAddonCommands()
      }
      self.action[key]({input, origin})
    },

    onInputOver: function(sender){
      const input = sender.userInfo.content
      const key = sender.userInfo.key
      const addonName = sender.userInfo.name
      self.config[addonName][key] = input
      self.utils.showHUD("输入已保存", 1)
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
      if(self.show) {
        self.SettingViewController.view.removeFromSuperview()
        NSUserDefaults.standardUserDefaults().setObjectForKey(false,'marginnote_ohmymn_show')
        self.show = false
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
            showHUD("OhMyMN 与脑图更配喔")
          }
          self.studyController.view.addSubview(self.SettingViewController.view)
          self.layoutViewController(self.config.OhMyMN.rightMode)
          NSUserDefaults.standardUserDefaults().setObjectForKey(true,'marginnote_ohmymn_show')
          self.show = true
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
      },
      addonWillDisconnect: function() {
      },
      applicationWillEnterForeground: function() {
      },
      applicationDidEnterBackground: function() {
      },
      applicationDidReceiveLocalNotification: function(notify) {
      },
    })
  return newAddonClass
}
