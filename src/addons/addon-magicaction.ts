import { excerptNotes } from "utils/notebook"
import { log, showHUD } from "utils/public"

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
            label: '重命名标题',
            key: 'renameChecked',
            help: '%s 为原标题',
        }
    ]
}

const util = {}

const action: IActionMethod = {
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