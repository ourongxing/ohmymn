import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { escapeURLParam, unescapeURLParam } from "~/utils"
import { reverseEscape } from "~/utils/input"
import { removeHighlight } from "~/utils/note"
import { AddTags } from "./typings"

export function getDtContent(
  node: MbBookNote,
  content_list: string[],
  content_key: string[],
  addTags: number[],
  tags: string
) {
  const finalContent = content_list.reduce((acc, cur) => {
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
  for (const value of finalContent) {
    if (value != "") {
      if (content_key[num] == "location") {
        const proValue = unescapeURLParam(value)
        output += content_key[num] + "=" + proValue + "&"
      } else {
        output += content_key[num] + "=" + value + "&"
      }
    }
    num++
  }
  console.log(output, "export2devonthink")
  console.log(addTags, "export2devonthink")
  console.log(tags, "export2devonthink")
  const proTags = (() => {
    if (addTags[0] === AddTags.CardTags) {
      return renderTemplateOfNodeProperties(node, "{{#tags}}{{.}},{{/tags}}")
    } else if (addTags[0] === AddTags.Custom && tags) {
      return renderTemplateOfNodeProperties(node, reverseEscape(tags, true))
    }
  })()
  console.log(proTags, "export2devonthink")
  if (proTags) {
    return output + "tags=" + proTags
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
    const contentList = [
      title,
      comment,
      destination,
      pdfsource,
      hide,
      referrer,
      width,
      paginated
    ]
    const contentKey = [
      "title",
      "comment",
      "destination",
      "location",
      "hide",
      "referrer",
      "width",
      "paginated"
    ]
    const output = getDtContent(node, contentList, contentKey, addTags, tags)
    return "x-devonthink://createPDF?" + output
  } else if (self.globalProfile.export2devonthink.exportMethod[0] == 1) {
    const contentList = [
      title,
      comment,
      destination,
      htmlsource,
      hide,
      referrer
    ]
    const contentKey = [
      "title",
      "comment",
      "destination",
      "location",
      "hide",
      "referrer"
    ]
    const output = getDtContent(node, contentList, contentKey, addTags, tags)
    return "x-devonthink://createHTML?" + output
  } else if (self.globalProfile.export2devonthink.exportMethod[0] == 2) {
    console.log(
      [title, comment, destination, mdtext, hide, referrer],
      "export2devonthink"
    )
    const contentList = [title, comment, destination, mdtext, hide, referrer]
    const contentKey = [
      "title",
      "comment",
      "destination",
      "text",
      "hide",
      "referrer"
    ]
    const output = getDtContent(node, contentList, contentKey, addTags, tags)
    return "x-devonthink://createMarkdown?" + output
  } else if (self.globalProfile.export2devonthink.exportMethod[0] == 3) {
    const contentList = [title, comment, destination, txtext, hide, referrer]
    const contentKey = [
      "title",
      "comment",
      "destination",
      "text",
      "hide",
      "referrer"
    ]
    const output = getDtContent(node, contentList, contentKey, addTags, tags)
    return "x-devonthink://createText?" + output
  }
  return ""
}
