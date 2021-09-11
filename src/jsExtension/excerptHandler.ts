import { profile } from "profile"
import { getCommentIndex, getNotebookById, getNoteById, undoGrouping } from "utils/notebook"
import { delayBreak, isBroadened, isHalfWidth, log, showHUD } from "utils/public"
import { genTitleText } from "./newExcerptGenerater"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR: boolean
let isComment: boolean
let isModifying: boolean

export default async (_note: MbBookNote, lastExcerptText = "") => {
    log("正在处理摘录", "excerpt")
    // 初始化全局变量
    note = _note
    isOCR = false
    isComment = note.groupNoteId ? true : false
    isModifying = lastExcerptText ? true : false
    if (isComment) nodeNote = getNoteById(note.groupNoteId!)

    /*
    * 图片 -> OCR -> 自动矫正
    * 文字 -> 自动矫正
    * OCR 要等，再处理
    * 自动矫正也要等，再处理
    */

    if (note.excerptPic) {
        let autoOCR = false
        const noteBook = getNotebookById(note.notebookId!)
        if (noteBook?.options?.autoOCRMode) autoOCR = true
        log("摘录是图片", "excerpt")
        if (autoOCR) {
            const success = await delayBreak(20, 0.1, () => note.excerptText ? true : false)
            if (success) {
                log("OCR 成功", "excerpt")
                isOCR = true
            } else {
                log("OCR 失败，没有文字", "excerpt")
                return
            }
        } else {
            log("没有开启自动 OCR 选项，不处理图片", "excerpt")
            return
        }
    }

    if (profile.ohmymn.autoCorrect) {
        log("开始矫正", "excerpt")
        const originText = note.excerptText!
        note.excerptText = "😎"
        // 等待在线矫正返回结果
        const success = await delayBreak(Number(profile.ohmymn.waitTime ?? 2) / 0.1, 0.1, () => note.excerptText != "😎")
        if (success) log("矫正成功", "excerpt")
        else {
            log("矫正失败或无须矫正", "excerpt")
            note.excerptText = originText
            if (!profile.ohmymn.dontShowHUD)
                showHUD("OhMyMN 提醒您：当前文档无须自动矫正，为避免不必要的等待，请关闭 MN 和 OhMyMN 自动矫正的选项", 3)
        }
    }

    if (isModifying && profile.ohmymn.lockExcerpt && lastExcerptText != "😎") {
        log("检测到开启锁定摘录选项，还原摘录", "excerpt")
        processExcerpt(undefined, lastExcerptText)
        return
    }
    excerptHandler()
}

const excerptHandler = () => {
    if (!note.excerptText?.trim()) return
    let { title, text } = genTitleText(note.excerptText!.trim())

    // 如果摘录是作为评论，反正是卡片已经存在的情况下摘录
    if (isComment) {
        log("当前摘录作为评论", "excerpt")
        const nodeTitle = nodeNote?.noteTitle
        if (profile.anotherautotitle.mergeTitle && nodeTitle && title) {
            const semi = isHalfWidth(nodeTitle) ? "; " : "；"
            title = nodeTitle + semi + title
        }
    }

    // 拓宽作为标题的摘录，可以不受到规则的限制，直接转为标题
    if (isModifying && profile.anotherautotitle.changeTitleNoLimit && !title && isBroadened(note?.noteTitle, text)) {
        log("正在拓宽作为标题的摘录", "excerpt")
        title = text
        text = ""
    }

    log(title ? "当前标题是：" + title : "没有标题", "excerpt")
    log(text ? "当前摘录内容是：" + text : "摘录转为了标题", "excerpt")
    processExcerpt(title, text)
}

const processExcerpt = (title: string | undefined, text: string) => {
    undoGrouping(note.notebookId!, () => {
        if (text) note.excerptText = text
        // 如果摘录为空，有三种情况
        else {
            if (isComment) {
                const index = getCommentIndex(nodeNote, note)
                if (index != -1) nodeNote.removeCommentByIndex(index)
                // 如果节点摘录是 OCR 后变成标题了，这时候又来了一个标题，必须将节点摘录的内容设置为
                // 标题才能隐藏内容。
                if (nodeNote.excerptText == nodeNote.noteTitle)
                    nodeNote.excerptText = title
            }
            // OCR 不能清空，否则会显示图片，必须设置为标题一样才能不显示
            // 虽然说 isComment 与 isOCR 不冲突，但如果是评论，会直接删掉
            else if (isOCR) note.excerptText = title
            else note.excerptText = ""
        }
        // 设置标题必须放在后面，前面会用到以前的标题
        if (title) isComment ? nodeNote.noteTitle = title : note.noteTitle = title
    })
}