import { lang } from "./lang"
import { IActionMethod4Card } from "typings"
import { showHUD } from "utils/common"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2ReplaceParam
} from "utils/input"
import { getNodeTree } from "utils/note"
import { SerialCode } from "utils/text"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"

const genCharArray = (char: string, len: number, step = 1): string[] => {
  const serialCode = Object.values(SerialCode).filter(k => k.includes(char))[0]
  if (!serialCode) throw ""
  const charArr = []
  const startIndex = serialCode.search(char)
  for (
    let i = startIndex, end = startIndex + len * step - 1;
    i <= end;
    i = i + step
  ) {
    charArr.push(serialCode[i % serialCode.length])
  }
  return charArr
}

const genNumArr = (num: number, len: number, step = 1, digit = 0) => {
  const numArr = []
  for (let i = num, end = num + len * step - 1; i <= end; i = i + step) {
    numArr.push(String(i).padStart(digit, "0"))
  }
  return numArr
}

export const getSerialInfo = (newSubStr: string, length: number) => {
  // string[] len>2 , [string, number], [string] 三种情况
  const serialArr = reverseEscape(
    newSubStr.replace(/^.*%(\[.+\]).*$/, "$1").replace(/'/g, '"')
  ) as any[]
  const len = serialArr.length
  if (len == 0 || typeof serialArr[0] !== "string")
    throw "数组内必须有元素，并且第一个元素必须是字符"
  if (len == 1 || (len == 2 && typeof serialArr[1] == "number")) {
    const step = len == 1 ? 1 : (serialArr[1] as number)
    const startValue = serialArr[0]
    // 如果是数字
    if (/^[0-9]+$/.test(startValue))
      return genNumArr(Number(startValue), length, step, startValue.length)
    // 如果是其他字符，一个字节
    else if (startValue.length === 1)
      return genCharArray(startValue, length, step)
    else throw "必须输入数字和单个字符"
  } // 自定义替换字符，数组元素长度大于 1，如果长度为 2，则第二个为字符串
  else if (len > 1 && serialArr.every(k => typeof k == "string"))
    return serialArr as string[]
  else throw "不符合输入格式要求"
}

const getSerialByIndex = (startValue: string, index: number) => {
  if (/^[0-9]+$/.test(startValue))
    return String(Number(startValue) + index).padStart(startValue.length, "0")
  const serialCode = Object.values(SerialCode).filter(k =>
    k.includes(startValue)
  )[0]
  if (!serialCode) throw ""
  const len = serialCode.length
  const startIndex = serialCode.search(startValue)
  return serialCode[(startIndex + index) % len]
}

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
    : `(/^.*$/g, "${escapeDoubleQuote(content)}")`
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
            node.noteTitle = title.replace(
              regexp,
              renderTemplateOfNodeProperties(node, newTitles[index])
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
        node.noteTitle = title.replace(
          regexp,
          renderTemplateOfNodeProperties(node, newTitles[index])
        )
    })
  }
  // 或者直接替换
  else {
    nodes.forEach(node => {
      const title = node.noteTitle ?? ""
      node.noteTitle = title.replace(
        regexp,
        renderTemplateOfNodeProperties(node, newSubStr)
      )
    })
  }
}
