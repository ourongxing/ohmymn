import autostandardize from "./addon-autostandardize";
import ohmymn from "./addon-ohmymn";
import magicaction from "addons/addon-magicaction";
import autocomplete from "./addon-autocomplete";
import anotherautotitle from "./addon-anotherautotitle";
import autolist from "./addon-autolist";
import autoreplace from "./addon-autoreplace";

interface IAddon {
    config: IConfig,
    util: {},
    action: {}
}

// 不要包含 magication，不存在，顺序为显示的顺序，magiction 始终为第1个
const addons: IAddon[] = [
    ohmymn,
    anotherautotitle,
    autostandardize,
    autocomplete,
    autoreplace,
    autolist
]


const genActionsUtils = () => {
    // 为了避免循环引用，配置文件还是自己写比较好
    const utils: any = {}
    const actions: any = { ...magicaction.action }
    for (const addon of addons) {
        const name = addon.config.name.toLowerCase()
        utils[name] = addon.util
        Object.assign(actions, addon.action)
    }
    return { actions, utils }
}

export const { actions, utils } = genActionsUtils()

const genSection = (config: IConfig): ISection => {
    const rows: Array<IRow> = [{
        type: cellViewType.plainText,
        label: config.intro,
        link: config.link ?? ""
    }]
    for (const setting of config.settings) {
        // magicaction 的 help 显示在弹窗上
        if (setting.help && config.name.toLowerCase() != "magicaction") rows.push({
            type: cellViewType.plainText,
            label: setting.help,
            link: setting.link ?? ""
        }, setting)
        else rows.push(setting)
    }
    return {
        header: config.name,
        rows
    }
}

export const genDataSource = (configs: Array<IConfig>, magicaction: IConfig): Array<ISection> => {
    const dataSource: Array<ISection> = []
    for (let config of configs) {
        dataSource.push(genSection(config))
        if (config.actions.length) {
            for (let action of config.actions)
                magicaction.actions.push(action)
        }
        magicaction.settings = magicaction.actions.sort(
            (a: ISetting, b: ISetting) => {
                const val1 = a.label!.length;
                const val2 = b.label!.length;
                return val1 - val2;
            }
        )
    }
    dataSource.splice(0, 0, genSection(magicaction))
    return dataSource
}

export const dataSource: Array<ISection> = genDataSource(addons.map(addon => addon.config), magicaction.config)