import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { escapeURLParam, unescapeURLParam } from "@/utils"
import { openUrl, showHUD } from "@/utils/common"
import { reverseEscape } from "@/utils/input"
import { removeHighlight } from "@/utils/note"
import { lang } from "./lang"
import { AddTags } from "./typings"

export function getDtContent(
  node: MbBookNote,
  content_list: string[],
  content_key: string[],
  addTags: number[],
  tags: string
) {
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
}

export async function getContent(node: MbBookNote, option: number) {
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
    const output = getDtContent(node, content_list, content_key, addTags, tags)
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
    const output = getDtContent(node, content_list, content_key, addTags, tags)
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
    const output = getDtContent(node, content_list, content_key, addTags, tags)
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
    const output = getDtContent(node, content_list, content_key, addTags, tags)
    return "x-devonthink://createText?" + output
  }
  return ""
}
