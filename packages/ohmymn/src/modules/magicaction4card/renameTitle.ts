import { renderTemplateOfNodeProperties } from "~/jsExtension/fetchNodeProperties"
import {
  getSerialByIndex,
  getSerialInfo,
  reverseEscape,
  escapeDoubleQuote,
  string2ReplaceParam
} from "~/utils"
import { type NodeNote, showHUD } from "marginnote"
import lang from "./lang"

export function getLayerSerialInfo(newSubStr: string, treeIndex: number[][]) {
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

export function renameTitle(content: string, nodes: NodeNote[]) {
  content = /^\(.*\)$/.test(content)
    ? content
    : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
  const { newSubStr, regexp } = string2ReplaceParam(content)[0]
  // 分层编号命名
  if (/#\[(.+)\]/.test(newSubStr)) {
    const isHavingChildren = nodes.every(
      node =>
        nodes[0].parentNode?.nodeId === node.parentNode?.nodeId &&
        node?.childNodes?.length
    )
    if (isHavingChildren) {
      nodes.forEach(node => {
        const { treeIndex, descendant } = node.descendantNodes
        const newTitles = getLayerSerialInfo(newSubStr, treeIndex).map(k =>
          newSubStr.replace(/#\[(.+)\]/, k)
        )
        descendant.forEach((node, index) => {
          const title = node.note.noteTitle ?? ""
          if (newTitles[index]) {
            node.title = title.replace(
              regexp,
              renderTemplateOfNodeProperties(node, newTitles[index])
            )
          }
        })
      })
    } else {
      showHUD(lang.hierarchical_numbering, 2)
      return
    }
  }

  // 如果含有编号信息，就获取新的 replaceValue
  else if (/%\[(.+)\]/.test(newSubStr)) {
    const newTitles = getSerialInfo(newSubStr, nodes.length).map(k =>
      newSubStr.replace(/%\[(.+)\]/, k)
    )
    nodes.forEach((node, index) => {
      const title = node.note.noteTitle ?? ""
      if (newTitles[index])
        node.title = title.replace(
          regexp,
          renderTemplateOfNodeProperties(node, newTitles[index])
        )
    })
  }

  // 或者直接替换
  else {
    nodes.forEach(node => {
      const title = node.note.noteTitle ?? ""
      node.title = title.replace(
        regexp,
        renderTemplateOfNodeProperties(node, newSubStr)
      )
    })
  }
}
