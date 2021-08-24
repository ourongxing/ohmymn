import { dict } from "utils/dict"
import profile from "profile"
import { log } from "utils/public"

const config: IConfig = {
  name: "AutoComplete",
  intro: "补全单词词形，只支持动词和名词\n需要配合 AnotherAutoTitle 使用",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行",
    },
    {
      key: "fillExplanation",
      type: cellViewType.switch,
      label: "填充单词解释",
      help: "覆盖小学到托福词汇"
    },
    {
      key: "fillFrequency",
      type: cellViewType.switch,
      label: "填充单词词频",
    },
  ],
  actions: [
    {
      key: "completeSelected",
      type: cellViewType.button,
      label: "补全单词词形",
    }
  ]
}

const util = {
  checkGetWord(text: string) {
    text = text.toLowerCase()
    // 判断一下是否是单词，或许可以降低点内存消耗
    if (!/^[a-z]+$/.test(text) || !dict[text]) return false
    const autocomplete = profile.autocomplete
    let word = dict[text]
    if (word.lemma) word = dict[word.lemma]
    const wordObj = { title: text, text: "" }
    let tmp_text = []
    if (word.exchange) wordObj.title = text + "; " + word.exchange.replace(/-/g, text).replace(/;/g, "; ")
    if (autocomplete.fillExplanation && word.explain) tmp_text.push(word.explain)
    if (autocomplete.fillFrequency && word.frequency) tmp_text.push(word.frequency)
    wordObj.text = tmp_text.join("\n\n")
    return wordObj
  },
}
const action: IActionMethod = {
  // 如果有标题摘录为空，或者摘录与标题相同时，才会起作用
  completeSelected({ nodes }) {
    for (const note of nodes) {
      const title = note?.noteTitle
      const text = note?.excerptText
      if (title) {
        const wordObj = util.checkGetWord(title)
        if (wordObj) {
          note.noteTitle = wordObj.title
          if (!text || text == title) {
            note.excerptText = wordObj.text
          }
        }
      }
    }
  }
}

export default { config, util, action }