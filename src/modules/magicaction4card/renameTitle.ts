import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { IActionMethod4Card } from "~/typings"
import { showHUD } from "~/utils/common"
import {
  reverseEscape,
  escapeDoubleQuote,
  string2ReplaceParam
} from "~/utils/input"
import { getNodeTree, modifyNodeTitle } from "~/utils/note"
import { getSerialByIndex, getSerialInfo } from "~/utils/number"
import { lang } from "./lang"

export const getLayerSerialInfo = (
  newSubStr: string,
  treeIndex: number[][]
) => {
  // string[], [...string[],[string,number]] 均可省略
  const serialArr = reverseEscape(
    newSubStr.replace(/^.*#(\[.+\]).*$/, "$1").replace(/'/g, '"')
  ) as any[]
  const option = {
    linkCode: ".",
    MAXLevel: Infinity
  }
  if (Array.isArray(serialArr[serialArr.length - 1])) {
    const opt = serialArr.pop() as any[]
    if (opt.length > 2) throw "option 数组必须两个元素以内"
    opt.forEach(k => {
      if (typeof k === "number") option.MAXLevel = k
      else if (typeof k === "string") option.linkCode = k
      else throw "option 数组内只能是 number 或 string"
    })
  }
  const len = serialArr.length
  if (len == 0 || serialArr.some(serial => typeof serial !== "string"))
    throw "除开 option 必须还有元素，并且都必须是 string"
  // [[0],[1],[2],[2,0],[2,1],[2,1,1,1]]
  return treeIndex.map(nodeIndex =>
    nodeIndex.length <= option.MAXLevel
      ? nodeIndex
          .map((index, _index) => {
            return getSerialByIndex(
              serialArr[_index > len - 1 ? len - 1 : _index],
              index
            )
          })
          .join(option.linkCode)
      : ""
  )
}

export const renameTitle: IActionMethod4Card = ({ content, nodes }) => {
  content = /^\(.*\)$/.test(content)
    ? content
    : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
  const { newSubStr, regexp } = string2ReplaceParam(content)[0]
  // 分级序列命名
  if (/#\[(.+)\]/.test(newSubStr)) {
    const isHavingChildren = nodes.every(
      node =>
        nodes[0].parentNote === node.parentNote && node?.childNotes?.length
    )
    if (isHavingChildren) {
      nodes.forEach(node => {
        // 只处理子节点
        const { treeIndex, onlyChildren } = getNodeTree(node)
        const newTitles = getLayerSerialInfo(newSubStr, treeIndex).map(k =>
          newSubStr.replace(/#\[(.+)\]/, k)
        )
        onlyChildren.forEach((node, index) => {
          const title = node.noteTitle ?? ""
          if (newTitles[index])
            modifyNodeTitle(
              node,
              title.replace(
                regexp,
                renderTemplateOfNodeProperties(node, newTitles[index])
              )
            )
        })
      })
    } else {
      showHUD(lang.hud.hierarchical_numbering, 2)
      return
    }
  }
  // 如果含有序列信息，就把获取新的 replace 参数
  else if (/%\[(.+)\]/.test(newSubStr)) {
    const newTitles = getSerialInfo(newSubStr, nodes.length).map(k =>
      newSubStr.replace(/%\[(.+)\]/, k)
    )
    nodes.forEach((node, index) => {
      const title = node.noteTitle ?? ""
      if (newTitles[index])
        modifyNodeTitle(
          node,
          title.replace(
            regexp,
            renderTemplateOfNodeProperties(node, newTitles[index])
          )
        )
    })
  }
  // 或者直接替换
  else {
    nodes.forEach(node => {
      const title = node.noteTitle ?? ""
      modifyNodeTitle(
        node,
        title.replace(regexp, renderTemplateOfNodeProperties(node, newSubStr))
      )
    })
  }
}
