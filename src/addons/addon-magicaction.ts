import { __values } from "tslib"
import { excerptNotes } from "utils/notebook"
import { log, showHUD, string2ReplaceParam } from "utils/public"

const config: IConfig = {
    name: "MagicAction",
    intro: "请注意，以下功能均为选中卡片后使用\n点击查看具体使用方法和注意事项",
    link: "https://github.com/ourongxing",
    settings: [],
    actions: [
        {
            type: cellViewType.buttonWithInput,
            label: '修改摘录填充',
            help: '输入填充索引，也就是顺序，1 到 4',
            key: 'changeFillChecked',
        },
        {
            type: cellViewType.buttonWithInput,
            label: '修改摘录颜色',
            key: 'changeColorChecked',
            help: '输入颜色索引，也就是顺序，1 到 16',
        },
        {
            type: cellViewType.buttonWithInput,
            label: '批量重命名标题',
            key: 'renameChecked',
            help: '注意事项及具体输入格式见顶上帮助信息',
        }
    ]
}

const util = {
    genCharArray(char: string, len: number, step: number = 1): string[] {
        const charArr = []
        let i = char.charCodeAt(0)
        const end = i + len * step - 1
        for (; i <= end; i = i + step) {
            charArr.push(String.fromCharCode(i))
        }
        return charArr
    },
    genNumArr(num: number, len: number, step = 1, digit = 0) {
        const numArr = []
        const end = num + len * step - 1
        for (let i = num; i < end; i = i + step) {
            numArr.push(String(i).padStart(digit, '0'))
        }
        return numArr
    },
    getSerialInfo(replace: string, length: number): string[] {
        const seriaInfo = replace.match(/%\[(.*)\]/)![0].substr(1).replace(/'/g, "\"")
        // 将序列信息转成数组
        const seriaInfo_arr = JSON.parse(`{ "key": ${seriaInfo} }`).key

        // 自定义替换字符，数组元素大于 2
        if (seriaInfo_arr.length > 2)
            return seriaInfo_arr.map((item: string) => replace.replace(/%\[(.*)\]/, item))

        else {
            if (seriaInfo_arr[1] && typeof seriaInfo_arr[1] !== "number")
                throw new Error("")
            let step: number = 1
            if (seriaInfo_arr[1]) step = seriaInfo_arr[1]
            // 序列只有两种情况，字母，和数字。
            const inival = seriaInfo_arr[0]

            // 字母有大写和小写
            if (/^[A-Za-z]$/.test(inival)) {
                const serias = this.genCharArray(inival, length, step)
                return serias.map((item: string) => replace.replace(/%\[(.*)\]/, item))
            }
            // 数字要补零
            else if (!isNaN(Number(inival))) {
                const serias = this.genNumArr(Number(inival), length, step, inival.length)
                return serias.map((item: string) => replace.replace(/%\[(.*)\]/, item))
            }
            else throw new Error("")
        }
    }
}

const action: IActionMethod = {
    renameChecked({ content, nodes }) {
        // 如果是矩形拖拽选中，则为从左到右，从上至下的顺序
        // 如果单个选中，则为选中的顺序

        // 检查输入正确性
        try {
            const params = string2ReplaceParam(content)
            let newReplace: string[] = []
            // 如果含有序列信息，就把获取新的 replace 参数
            if (/%\[(.*)\]/.test(params[0].replace)) {
                newReplace = util.getSerialInfo(params[0].replace, nodes.length)
                nodes.forEach((note, index) => {
                    const title = note.noteTitle ?? ""
                    if (newReplace[index]) {
                        note.noteTitle = title.replaceAll(params[0].regexp, newReplace[index])
                    }
                })
            }
            // 或者直接替换
            else {
                nodes.forEach((note, index) => {
                    const title = note.noteTitle ?? ""
                    note.noteTitle = title.replaceAll(params[0].regexp, params[0].replace)
                })
            }
        } catch {
            showHUD("输入不正确")
        }
    },
    changeFillChecked({ content, nodes }) {
        // 使下标从 1 开始
        const index = Number(content)
        if (!isNaN(index) && index <= 4 && index > 0) {
            for (const node of nodes) {
                const notes = excerptNotes(node)
                for (const note of notes) {
                    note.fillIndex = index - 2
                }
            }
        } else {
            showHUD("输入不正确")
        }
    },
    changeColorChecked({ content, nodes }) {
        // 使下标从 1 开始
        const index = Number(content)
        if (!isNaN(index) && index <= 16 && index > 0) {
            for (const node of nodes) {
                const notes = excerptNotes(node)
                for (const note of notes) {
                    note.colorIndex = index - 1
                }
            }
        } else {
            showHUD("输入不正确")
        }
    },
}

export default { config, util, action }