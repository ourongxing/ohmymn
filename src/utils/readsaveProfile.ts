import { dataSource } from "addons/synthesizer"
import { log, showHUD } from "utils/public"
import profile from "profile"

// 读配置包含两种情况
// 1.刚打开一个笔记本，读两个配置文件，然后合并
// 2.切换文档，只需要读取 doc 配置

// 暂时没有更好的办法实现文档配置和全局配置分开处理，循环赋值开销很大
interface Profile_doc {
    autoOCR: boolean,
    autoCorrect: boolean,
}
// 重置这两项，不保存这两项
const reset: Profile_doc = {
    autoOCR: false,
    autoCorrect: false,
}

const profile_doc: { [k: string]: Profile_doc } = { }

const refreshDocDataSource = (doc_profile: Profile_doc) => {
    for (const row of dataSource[1].rows) {
        switch (row.key) {
            case "autoCorrect":
                row.status = doc_profile.autoCorrect
                break;
            case "autoOCR":
                row.status = doc_profile.autoOCR
        }
    }
}

export const readProfile = (docmd5: string, readAll = false) => {
    if (readAll) {
        let tmp_global = NSUserDefaults.standardUserDefaults()
            .objectForKey("marginnote_ohmymn_profile_global")
        if (tmp_global) {
            Object.assign(profile, JSON.parse(tmp_global))
            for (const section of dataSource) {
                for (const row of section.rows) {
                    switch (row.type) {
                        case cellViewType.switch:
                            row.status = <boolean>profile[section.header.toLowerCase()][row.key!]
                            break;
                        case cellViewType.input: case cellViewType.inlineInput:
                            row.content = <string>profile[section.header.toLowerCase()][row.key!]
                    }
                }
            }
        }
    }
    let tmp_doc = NSUserDefaults.standardUserDefaults()
        .objectForKey("marginnote_ohmymn_profile_doc")
    if (tmp_doc && JSON.parse(tmp_doc)[docmd5]) {
        // 只有 ohmymn 里的可以保存为仅本文档
        Object.assign(profile.ohmymn, JSON.parse(tmp_doc)[docmd5])
        Object.assign(profile_doc, JSON.parse(tmp_doc))
        refreshDocDataSource(JSON.parse(tmp_doc)[docmd5])
        log("检测到配置，正在读取", "profile")
        log(JSON.parse(tmp_doc)[docmd5], "profile")
    } else {
        // 如果当前文档没有，就用默认值
        Object.assign(profile.ohmymn, reset)
        log("当前文档第一次打开，使用默认值", "profile")
        refreshDocDataSource(reset)
    }
}

// 切换的时候仅保存当前文档的，退出的时候全部保存
export const saveProfile = (docmd5: string, saveAll = false) => {
    const thisDocProfile = {
        autoOCR: profile.ohmymn.autoOCR,
        autoCorrect: profile.ohmymn.autoCorrect,
    }
    NSUserDefaults.standardUserDefaults().setObjectForKey(
        JSON.stringify(Object.assign(profile_doc, { [docmd5]: thisDocProfile })),
        "marginnote_ohmymn_profile_doc")
    log("保存文档配置", "profile")
    log(thisDocProfile, "profile")
    if (saveAll) {
        log("保存全部配置", "profile")
        NSUserDefaults.standardUserDefaults().setObjectForKey(
            JSON.stringify(profile), "marginnote_ohmymn_profile_global")
    }
}