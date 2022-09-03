import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { IActionMethod4Card } from "~/typings"
import {
  getSerialByIndex,
  getSerialInfo,
  reverseEscape,
  escapeDoubleQuote,
  string2ReplaceParam
} from "~/utils"
import { showHUD, getNodeTree, modifyNodeTitle } from "~/sdk"
import { lang } from "./lang"

export const getLayerSerialInfo = (
  newSubStr: string,
  treeIndex: number[][]
) => {
  // string[], [...string[],[string,number,boolean]]
  const serialArr = reverseEscape(
    newSubStr.replace(/^.*#(\[.+\]).*$/, "$1").replace(/'/g, '"')
  ) as any[]
  const option = {
    connectionSymbol: ".",
    maxLevel: 999,
    onlyShowCurrentLayer: false
  }
  if (Array.isArray(serialArr[serialArr.length - 1])) {
    // 最后一个数组
    const opt = serialArr.pop() as (number | string | boolean)[]
    const [connectionSymbol, maxLevel, onlyShowCurrentLayer] = [
      opt.find(k => typeof k === "string"),
      opt.find(k => typeof k === "number"),
      opt.find(k => typeof k === "boolean")
    ]
    if (connectionSymbol !== undefined)
      option.connectionSymbol = connectionSymbol as string
    if (maxLevel !== undefined) option.maxLevel = maxLevel as number
    if (onlyShowCurrentLayer !== undefined)
      option.onlyShowCurrentLayer = onlyShowCurrentLayer as boolean
  }
  const len = serialArr.length
  if (len == 0 || serialArr.some(serial => typeof serial !== "string"))
    throw "除开 option 必须还有元素，并且都必须是 string"
  // [[0],[1],[2],[2,0],[2,1],[2,1,1,1]]
  return treeIndex.map(nodeIndex => {
    const indexLen = nodeIndex.length
    if (option.onlyShowCurrentLayer) nodeIndex = nodeIndex.slice(-1)
    return indexLen <= option.maxLevel
      ? nodeIndex
          .map((index, _index) => {
            return getSerialByIndex(
              serialArr[_index > len - 1 ? len - 1 : _index],
              index
            )
          })
          .join(option.connectionSymbol)
      : ""
  })
}

export const renameTitle: IActionMethod4Card = ({ content, nodes }) => {
  content = /^\(.*\)$/.test(content)
    ? content
    : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
  const { newSubStr, regexp } = string2ReplaceParam(content)[0]
  // 分层编号命名
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
  // 如果含有编号信息，就获取新的 replaceValue
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
