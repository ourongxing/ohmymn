const Actions = JSB.defineClass('Actions : NSObject')
Actions.prototype.init = () => ({
  listChecked: function(_self, utils, param){
    utils.log(param)
  },
  completeChecked: function(_self, utils, param){
    utils.log(param)
  },
  fillChecked: function(_self, utils, param){
    utils.log(param)
  },
  standardizeChecked: function(_self, utils, param){
    const nodes = utils.selectNodes(_self)
    for(node of nodes) {
      const title = utils.getNoteTitle(node)
      if(title) node.noteTitle = utils.standardizeText(title)
      const notes = utils.excerptNotes(node)
      for(note of notes) {
        const text = utils.getNoteText(note)
        if (text) note.excerptText = utils.standardizeText(text)
      }
    }
    utils.refreshNotebook(_self)
  },
  switchTitleorExcerpt: function(_self, utils, param){
    const nodes = utils.selectNodes(_self)
    for(note of nodes) {
      const title = utils.getNoteTitle(note)
      const text = utils.getNoteText(note)
      // 只允许存在一个
      if ((title || text) && !(title && text)) {
        note.noteTitle = text
        note.excerptText = title
      } else if (title == text) {
        // 摘录与标题相同时只显示标题，此时我们必然想切换到摘录
        note.noteTitle = ""
      }
    }
    utils.refreshNotebook(_self)
  },
  renameChecked: function(_self, utils, param){
    utils.log(param)
  },
  changeFillChecked: function(_self, utils, param){
    // 使下标从 1 开始
    const index = Number(param.input)
    if (!isNaN(index) && index <= 4 && index > 0) {
      const nodes = utils.selectNodes(_self)
      for(node of nodes) {
        const notes = utils.excerptNotes(node)
        for(note of notes) {
          note.fillIndex = index - 2
        }
      }
      utils.refreshNotebook(_self)
    } else {
      utils.showHUD(_self, "输入不正确", 1)
    }
  },
  changeColorChecked: function(_self, utils, param){
    const index = Number(param.input)
    if (!isNaN(index) && index <= 16 && index > 0) {
      const nodes = utils.selectNodes(_self)
      for(node of nodes) {
        const notes = utils.excerptNotes(node)
        for(note of notes) {
          note.colorIndex = index - 1
        }
      }
      utils.refreshNotebook(_self)
    } else {
      utils.showHUD(_self, "输入不正确", 1)
    }
  },
  replaceChecked: function(_self, utils, param){
    utils.log(param)
  }
})
