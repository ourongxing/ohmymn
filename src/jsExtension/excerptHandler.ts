import { dataSource, utils } from "addons/synthesizer"
import profile from "profile"
import { getCommentIndex, getNotebookById, getNoteById, undoGrouping } from "utils/notebook"
import { alert, delay, delayBreak, isHalfWidth, log, showHUD } from "utils/public"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR: boolean
let isComment: boolean
let isModifying: boolean

/**
 * 这几个函数的作用
 * 1. default：摘录入口，检测是否打开了 OCR 和自动矫正，并等待
 * 2. excerpthandler：处理摘录的入口
 * 3. genTitleText：这是各个插件集中处理的地方，生成新的标题和内容
 * 4. processExcerpt： 把新的标题和内容根据不同情况赋值给卡片
 */

export default async (_note: MbBookNote, _isModifying = false) => {
    log("正在处理摘录", "excerpt")
    // 初始化全局变量
    note = _note
    isOCR = false
    isComment = note.groupNoteId ? true : false
    isModifying = _isModifying
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
                isOCR = true
                log("OCR 成功", "excerpt")
                // 如果 OCR 获取到的值不是乱码，MN 貌似不会为其进行矫正
                if (!/^[^\u4e00-\u9fa5]*$/.test(note.excerptText!)
                    && /^[^\w\d]*$/.test(note.excerptText!)) {
                    log("不是乱码，无须矫正，直接处理", "excerpt")
                    excerptHandler()
                    return
                }
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
        const success = await delayBreak(20, 0.1, () => note.excerptText != "😎")
        if (success) log("矫正成功", "excerpt")
        else {
            log("矫正失败或无须矫正", "excerpt")
            note.excerptText = originText
            showHUD("_CAPNAME_ 提醒您：当前文档无须自动矫正，为避免出现错误，请关闭 MN 和 _CAPNAME_ 自动矫正的选项", 3)
        }
    }
    excerptHandler()
}

// 集中处理标题和摘录
const genTitleText = (text: string): { title?: string, text: string } => {
    if (profile.autostandardize.on)
        text = utils.autostandardize.standardizeText(text)
    if (profile.autolist.on)
        text = utils.autolist.listText(text)
    if (profile.autoreplace.on)
        text = utils.autoreplace.replaceText(text)

    // 判断是否能成为标题
    // autotitle 优先级应该是最低的
    if (profile.autocomplete.on) {
        const result = utils.autocomplete.checkGetWord(text)
        if (result) return {
            title: result.title,
            text: result.text
        }
    }
    if (profile.anotherautotitle.on) {
        const result = utils.anotherautotitle.checkGetTitle(text)
        // 可以作为标题
        if (result) return {
            title: result.title,
            text: result.text
        }
    }
    return { text }
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
    if (isModifying) {
        // 拓宽作为标题的摘录，可以不受到规则的限制，直接转为标题
        const originTitle = note?.noteTitle
        if (profile.anotherautotitle.changeTitleNoLimit && !title && originTitle
            && originTitle.length >= 2 && (text.startsWith(originTitle) || text.endsWith(originTitle))) {
            log("正在拓宽作为标题的摘录", "excerpt")
            title = text
            text = ""
        }
    }
    log(title ? "当前标题是：" + title : "没有标题", "excerpt")
    log(text ? "当前摘录内容是：" + text : "摘录转为了标题", "excerpt")
    processExcerpt(title, text)
}

const processExcerpt = (title: string | undefined, text: string) => {
    undoGrouping(note.notebookId!, () => {
        if (text) {
            note.excerptText = text
            // 如果摘录为空，有三种情况
        } else {
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
        if (title) {
            if (isComment) {
                nodeNote.noteTitle = title
            } else {
                note.noteTitle = title
            }
        }
    })
}