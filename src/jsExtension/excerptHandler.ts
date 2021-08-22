import { utils } from "addons/synthesizer"
import profile from "profile"
import { getCommentIndex, getNoteById, undoGrouping } from "utils/notebook"
import { isHalfWidth, log } from "../utils/public"

export const excerptHandler = (note: MbBookNote, isOCR = false) => {
    const groupNoteId = note?.groupNoteId
    let text = note.excerptText!.trim()
    let title = note?.noteTitle
    let changeTitle = false
    // 对于修改已经创建的摘录，处理步骤其实没什么变化，主要还是标题
    // 我个人认为对于已经有标题的摘录，并且标题还是摘录自动转的，在你重新修改摘录的时候
    // 只要没有大规模改动，修改摘录后的内容可以不受规则限制，直接转为标题，
    // 不过这里会设置一个开关，看具体的使用习惯
    if (text && title && title.length >= 2 && profile.anotherautotitle.changeTitleNoLimit) {
        if ((text.startsWith(title) || text.endsWith(title) || title.endsWith(text) || title.startsWith(text))) {
            changeTitle = true
        }
    }

    // 这里是插件的主要工作区间，就是修改摘录
    if (profile.ohmymn.defaultFullWidth) {
        text = utils.ohmymn.toFullWidth(text)
    } else if (profile.autostandardize.on) {
        text = utils.autostandardize.standardizeText(text)
    }

    undoGrouping("ohmymn", note.notebookId!, () => {
        // ------------
        // 先设置标题，这个插件的选项主管所有自动生成标题的功能
        if (profile.anotherautotitle.on) {
            const newTitle = utils.anotherautotitle.checkAutoTitle(text)
            if (newTitle) {
                // ---------
                // groupNoteId 是作为当前卡片摘录的 noteid，只有作为评论的摘录存在此属性
                // 可以实现拖拽合并标题，补充标题，并且设置标题后删除该评论
                if (groupNoteId) {
                    const thisNode = getNoteById(groupNoteId)
                    const thisNodeTitle = thisNode?.noteTitle
                    // 合并标题
                    if (thisNodeTitle && profile.anotherautotitle.mergeTitle) {
                        // 全半角就使用半角分号
                        if (isHalfWidth(text))
                            thisNode.noteTitle = thisNodeTitle + "; " + newTitle
                        else
                            thisNode.noteTitle = thisNodeTitle + "；" + newTitle
                    } else if (!thisNodeTitle) {
                        thisNode.noteTitle = newTitle
                    }
                    const index = getCommentIndex(thisNode, note)
                    if (index != -1) thisNode.removeCommentByIndex(index)
                }

                // ---------
                // 生成卡片，第一次摘录
                else {
                    const wordObj = utils.autocomplete.checkGetWord(text)
                    if (profile.autocomplete.on && wordObj) {
                        note.noteTitle = wordObj.title
                        note.excerptText = wordObj.text
                    } else {
                        note.noteTitle = newTitle
                        // OCR 如果清空文字的话，会显示图片，暂时无法删除图片
                        if (!isOCR) note.excerptText = ""
                    }
                }
            }
            // -----
            // 突然意思到有标题不一定是修改，因为我会执行两次
            else if (changeTitle) {
                note.noteTitle = text
                if (!isOCR) note.excerptText = ""
            }
            // ---------
            else {
                note.excerptText = text
            }
        }
    })
}