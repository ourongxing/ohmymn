JSB.require('panguIniter')
const Utils = JSB.defineClass('Utils : NSObject')
Utils.prototype.init = () => ({
  log: function(text){
    JSB.log("MNLOG %@", text)
  },
  showHUD: function(_self, text, sec = 2){
    Application.sharedInstance().showHUD(text, _self.window, sec)
  },
  selectNodes: function(_self){
    const MindMapNodes = _self.studyController.notebookController.mindmapView.selViewLst
    if(MindMapNodes) return MindMapNodes.map(item => item.note.note)
    else return []
  },
  refreshNotebook: function(_self){
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange', _self, { topicid: _self.tmp.notebookid })
  },
  // 判断摘录是否满足设置为标题的条件
  checkTitle: function(setting, text) {
    // if (self.config.AnotherAutoTitle.cusutomInput) {
    //   const reg = RegExp(/self.config.AnotherAutoTitle.cusutomInput/)
    // }
    if (self.config.AnotherAutoTitle.noPunctuation){
      const reg = RegExp(/[ 。、？?！!，,；;：:]/)
      self.utils.log("有标点：" + String(reg.test(text)))
      if(!reg.test(text)) return true
    }
    if(setting.wordCount && setting.wordCount > text.length) {
      return true
    }
    return false
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
  standardizeText: function(setting, text) {
    // pangu 主要是加空格，以及换成全角字符
    const pangu = PanguIniter.new().init()
    return pangu.spacing(text)
    // return ""
    // if (setting.defaultChinese) {
    //
    // }
  },
  getCommentIndex: function(node, commentNote) {
    const comments = node.comments
    for (let [index, value] of comments.entries()){
      if(value.noteid == commentNote.noteId)
        return index
    }
    return -1
  }
})
