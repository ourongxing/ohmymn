import { profile } from "profile"
import { log } from "utils/common"
import fetch from "utils/network"
import { isHalfWidth, wordCount } from "utils/text"

const config: IConfig = {
  name: "AutoComplete",
  intro: "补全单词词形，只支持动词和名词\n并自动设置为标题",
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
      help: "覆盖小学到托福词汇",
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
    },
  ],
}

const util = {
  async checkGetWord(text: string) {
    if (!isHalfWidth(text) && wordCount(text) != 1) return false
    const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + text).then(
      res => res.json()
    )
    const wordObj = { title: text, text: res[0].translation }
    return wordObj
    // if (!(/^[a-z]+$/.test(text))) return false
    // const autocomplete = profile.autocomplete
    // let word = dict[text]
    // if (word.lemma) {
    //   text = word.lemma
    //   word = dict[word.lemma]
    // }
    // let tmp_text = []
    // if (word.exchange) wordObj.title = text + "; " + word.exchange.replace(/-/g, text).replace(/;/g, "; ")
    // if (autocomplete.fillExplanation && word.explain) tmp_text.push(word.explain)
    // if (autocomplete.fillFrequency && word.frequency) tmp_text.push(word.frequency)
    // wordObj.text = tmp_text.join("\n\n")
  },
}
const action: IActionMethod = {
  // 如果有标题摘录为空，或者摘录与标题相同时，才会起作用
  async completeSelected({ nodes }) {
    for (const note of nodes) {
      const title = note?.noteTitle
      const text = note?.excerptText
      if (title) {
        const wordObj = await util.checkGetWord(title)
        if (wordObj) {
          note.noteTitle = wordObj.title
          if (!text || text == title) {
            note.excerptText = wordObj.text
          }
        }
      }
    }
  },
}

export default { config, util, action }
