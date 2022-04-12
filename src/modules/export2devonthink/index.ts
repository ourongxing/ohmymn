import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { escapeURLParam, unescapeURLParam } from "@/utils"
import { openUrl, showHUD } from "@/utils/common"
import { reverseEscape } from "@/utils/input"
import { removeHighlight } from "@/utils/note"
import { lang } from "./lang"
import { AddTags } from "./typings"

const { link, intro, lable, option, help } = lang

const configs: IConfig<"export2devonthink"> = {
  name: "Export to Devonthink",
  key: "export2devonthink",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Select,
      key: "exportMethod",
      option: ["PDF", "HTML", "Markdown", "Text"],
      label: "下载or导出"
    },
    {
      type: CellViewType.Switch,
      key: "showTemplate",
      label: "显示/隐藏所有模板"
    },
    {
      type: CellViewType.Input,
      key: "title",
      help: "标题",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "comment",
      help: "评论",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Select,
      key: "addTags",
      label: "添加标签",
      help: "固定添加在最后",
      option: ["无", "仅卡片中的标签", "自定义标签模板"]
    },
    {
      type: CellViewType.Input,
      key: "tags",
      help: "标签模版，点击查看支持的变量。",
      bind: [["addTags", 2]]
    },
    {
      type: CellViewType.Input,
      key: "destination",
      help: "目标文件夹(输入对应文件夹UUID)",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "htmlsource",
      help: "URL用于下载为HTML文件(请务必加上http或者https)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 1]
      ]
    },
    {
      type: CellViewType.Input,
      key: "pdfsource",
      help: "URL用于下载为PDF文件(请务必加上http或者https)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Input,
      key: "mdtext",
      help: "正文文本",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 2]
      ]
    },
    {
      type: CellViewType.Input,
      key: "txtext",
      help: "正文文本",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 3]
      ]
    },
    {
      type: CellViewType.Input,
      key: "hide",
      help: "隐藏(1/0)",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "referrer",
      help: "URL链接(用于引用)",
      bind: [["showTemplate", 1]]
    },
    {
      type: CellViewType.Input,
      key: "width",
      help: "宽度",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    },
    {
      type: CellViewType.Input,
      key: "paginated",
      help: "分页(1/0)",
      bind: [
        ["showTemplate", 1],
        ["exportMethod", 0]
      ]
    }
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "exportCard2app",
      label: "导出到Devonthink",
      method: async ({ nodes, option }) => {
        for (const node of nodes) {
          const c = await utils.getContent(node, option)
          console.log(c, "export2devonthink")
          if (c) {
            openUrl(c)
            console.log("success", "researchtool")
          } else showHUD("模版对应的内容为空")
        }
      }
    }
  ]
}

const utils = {
  getDtContent: (
    node: MbBookNote,
    content_list: string[],
    content_key: string[],
    addTags: number[],
    tags: string
  ) => {
    const content_final = content_list.reduce((acc, cur) => {
      if (cur) {
        const main = renderTemplateOfNodeProperties(
          node,
          reverseEscape(cur, true)
        )
        const c = removeHighlight(main).trim()
        if (c) {
          acc.push(escapeURLParam(c))
        } else {
          acc.push("")
        }
      } else {
        acc.push("")
      }
      return acc
    }, [] as string[])
    let num = 0
    let output = ""
    for (const value of content_final) {
      if (value != "") {
        if (content_key[num] == "location") {
          const pro_value = unescapeURLParam(value)
          output += content_key[num] + "=" + pro_value + "&"
        } else {
          output += content_key[num] + "=" + value + "&"
        }
      }
      num++
    }
    console.log(output, "export2devonthink")
    console.log(addTags, "export2devonthink")
    console.log(tags, "export2devonthink")
    const pro_tags = (() => {
      if (addTags[0] === AddTags.CardTags) {
        return renderTemplateOfNodeProperties(node, "{{#tags}}{{.}},{{/tags}}")
      } else if (addTags[0] === AddTags.Custom && tags) {
        return renderTemplateOfNodeProperties(node, reverseEscape(tags, true))
      }
    })()
    console.log(pro_tags, "export2devonthink")
    if (pro_tags) {
      return output + "tags=" + pro_tags
    } else {
      return output.slice(0, -1)
    }
  },

  async getContent(node: MbBookNote, option: number) {
    const {
      title,
      comment,
      addTags,
      tags,
      destination,
      htmlsource,
      pdfsource,
      mdtext,
      txtext,
      hide,
      referrer,
      width,
      paginated
    } = self.globalProfile.export2devonthink
    if (self.globalProfile.export2devonthink.exportMethod[0] == 0) {
      const content_list = [
        title,
        comment,
        destination,
        pdfsource,
        hide,
        referrer,
        width,
        paginated
      ]
      const content_key = [
        "title",
        "comment",
        "destination",
        "location",
        "hide",
        "referrer",
        "width",
        "paginated"
      ]
      const output = utils.getDtContent(
        node,
        content_list,
        content_key,
        addTags,
        tags
      )
      return "x-devonthink://createPDF?" + output
    } else if (self.globalProfile.export2devonthink.exportMethod[0] == 1) {
      const content_list = [
        title,
        comment,
        destination,
        htmlsource,
        hide,
        referrer
      ]
      const content_key = [
        "title",
        "comment",
        "destination",
        "location",
        "hide",
        "referrer"
      ]
      const output = utils.getDtContent(
        node,
        content_list,
        content_key,
        addTags,
        tags
      )
      return "x-devonthink://createHTML?" + output
    } else if (self.globalProfile.export2devonthink.exportMethod[0] == 2) {
      console.log(
        [title, comment, destination, mdtext, hide, referrer],
        "export2devonthink"
      )
      const content_list = [title, comment, destination, mdtext, hide, referrer]
      const content_key = [
        "title",
        "comment",
        "destination",
        "text",
        "hide",
        "referrer"
      ]
      const output = utils.getDtContent(
        node,
        content_list,
        content_key,
        addTags,
        tags
      )
      return "x-devonthink://createMarkdown?" + output
    } else if (self.globalProfile.export2devonthink.exportMethod[0] == 3) {
      const content_list = [title, comment, destination, txtext, hide, referrer]
      const content_key = [
        "title",
        "comment",
        "destination",
        "text",
        "hide",
        "referrer"
      ]
      const output = utils.getDtContent(
        node,
        content_list,
        content_key,
        addTags,
        tags
      )
      return "x-devonthink://createText?" + output
    }
    return ""
  }
}

export default { configs, utils }
