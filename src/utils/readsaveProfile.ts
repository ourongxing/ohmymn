import { dataSource } from "addons/synthesizer"
import { log } from "utils/public"
import profile from "profile"

// 读配置包含两种情况
// 1.刚打开一个笔记本，读两个配置文件，然后合并
// 2.切换文档，只需要读取 doc 配置

// 暂时没有更好的办法实现文档配置和全局配置分开处理，循环赋值开销很大
interface Profile_doc {
    autoOCR: boolean,
    autoCorrect: boolean,
    defaultFullWidth: boolean
}

const profile_doc: { [k: string]: Profile_doc } = {}

const refreshDocDataSource = (doc_profile: Profile_doc) => {
    for (const row of dataSource[1].rows) {
        switch (row.key) {
            case "autoCorrect":
                row.status = doc_profile.autoCorrect
                break;
            case "defaultFullWidth":
                row.status = doc_profile.defaultFullWidth
                break;
            case "autoOCR":
                row.status = doc_profile.autoOCR
        }
    }
}

export const readProfile = (docmd5: string, firstOpenDoc = false) => {
    if (firstOpenDoc) {
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
    }
}

// 切换的时候仅保存当前文档的，退出的时候全部保存
export const saveProfile = (docmd5: string, closeMN = false) => {
    const thisDocProfile = {
        autoOCR: profile.ohmymn.autoOCR,
        autoCorrect: profile.ohmymn.autoCorrect,
        defaultFullWidth: profile.ohmymn.defaultFullWidth
    }
    NSUserDefaults.standardUserDefaults().setObjectForKey(
        JSON.stringify(Object.assign(profile_doc, { [docmd5]: thisDocProfile })),
        "marginnote_ohmymn_profile_doc")
    log("保存文档配置", "profile")
    log(thisDocProfile, "profile")

    // 重置这两项，不保存这两项
    const reset = {
        autoOCR: false,
        autoCorrect: false,
        defaultFullWidth: false
    }
    // 返回的是 ohmymn
    Object.assign(profile.ohmymn, reset)
    if (closeMN) {
        NSUserDefaults.standardUserDefaults().setObjectForKey(
            JSON.stringify(profile), "marginnote_ohmymn_profile_global")
    } else {
        refreshDocDataSource(reset)
    }
}
// 只有刚打开文档才读取整个配置，只有关闭 MN 或失去焦点才保存整个配置
// 其他时候打开文档都只会读专属的配置，关闭只会保存专属的配置，同时重置全局配置
// 列表的刷新是读取 dataSource，每次保存专属配置的时候都会重置 dataSource 中的
// 但是关闭 MN 或者失去焦点的时候就没必要。
// 失去焦点不一定那个是退出，此时如果重置了那部分配置，回到焦点就要重新读取配置才行