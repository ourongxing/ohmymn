import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { ICheckMethod, MbBookNote } from "@/typings"
import { reverseEscape } from "@/utils/input"
import { AnkiNote, AddTags, ExportMethod } from "./typings"
import { OCNull2null } from "@/utils/common"
import fetch from "@/utils/network"

export class AnkiConnect {
  api!: string
  constructor(api: string) {
    this.api = api
  }
  async getModelFieldNames(modelName: string) {
    const res = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "modelFieldNames",
        version: 6,
        params: {
          modelName
        }
      }
    }).then(res => res.json())) as {
      result: string[] | OCNull
      error: string | OCNull
    }
    return {
      result: OCNull2null(res.result),
      error: OCNull2null(res.error)
    }
  }
  async getModelList() {
    const res = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "modelNames",
        version: 6
      }
    }).then(res => res.json())) as {
      result: string[] | OCNull
      error: string | OCNull
    }
    return {
      result: OCNull2null(res.result),
      error: OCNull2null(res.error)
    }
  }
  async addNotes(notes: AnkiNote[], autoSync: boolean) {
    const deckNames = (await this.getDeckList()).result
    const needAdd = []
    for (const note of notes) {
      if (!deckNames?.includes(note.deckName)) {
        await this.creatDeck(note.deckName)
        needAdd.push(note)
        continue
      }
      const res = await this.checkExist(note)
      if (res.result?.length) {
        await this.updateNote(note, res.result[0])
      } else {
        needAdd.push(note)
      }
    }

    const resAdd = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "addNotes",
        version: 6,
        params: {
          notes: needAdd.map(k => ({
            ...k,
            options: {
              allowDuplicate: true,
              duplicateScope: "deck"
            }
          }))
        }
      }
    }).then(res => res.json())) as {
      result: (string | OCNull)[]
      error: string | OCNull
    }
    autoSync && (await this.sync())
    return {
      result: resAdd.result.map(k => OCNull2null(k)),
      error: OCNull2null(resAdd.error)
    }
  }
  async getDeckList() {
    const res = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "deckNames",
        version: 6
      }
    }).then(res => res.json())) as {
      result: string[] | OCNull
      error: string | OCNull
    }
    return {
      result: OCNull2null(res.result),
      error: OCNull2null(res.error)
    }
  }
  async creatDeck(deck: string) {
    const res = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "createDeck",
        version: 6,
        params: {
          deck: deck
        }
      }
    }).then(res => res.json())) as {
      result: number | OCNull
      error: string | OCNull
    }
    return {
      result: OCNull2null(res.result),
      error: OCNull2null(res.error)
    }
  }
  async checkExist(note: AnkiNote) {
    const [key, value] = Object.entries(note.fields)[0]
    const res = (await fetch(this.api, {
      method: "POST",
      json: {
        action: "findNotes",
        version: 6,
        params: {
          query: `deck:"${note.deckName}" ${key}:"${value}"`
        }
      }
    }).then(res => res.json())) as {
      result: number[] | OCNull
      error: string | OCNull
    }
    return {
      result: OCNull2null(res.result),
      error: OCNull2null(res.error)
    }
  }
  async sync() {
    await fetch(this.api, {
      method: "POST",
      json: {
        action: "sync",
        version: 6
      }
    }).then(res => res.json())
  }
  async updateNote(note: AnkiNote, id: number) {
    await fetch(this.api, {
      method: "POST",
      json: {
        action: "updateNoteFields",
        version: 6,
        params: {
          note: {
            id,
            fields: note.fields
          }
        }
      }
    })
  }
}
export function genAnkiNote(node: MbBookNote, option: number): AnkiNote {
  const { tagTemplate, addTags } = self.globalProfile.export2anki
  const tags = (
    (() => {
      if (addTags[0] === AddTags.CardTags) {
        return renderTemplateOfNodeProperties(node, "{{#tags}}#{{.}} {{/tags}}")
      } else if (addTags[0] === AddTags.Custom && tagTemplate) {
        return renderTemplateOfNodeProperties(
          node,
          reverseEscape(tagTemplate, true)
        )
      }
    })() ?? ""
  )
    .split(/\s*?#\s*?/)
    .filter(k => k)

  let { deckName } = self.notebookProfile.export2anki
  if (!deckName) throw "请输入牌组名"
  else deckName = renderTemplateOfNodeProperties(node, deckName)
  const { modelName, fields } = Object.entries(
    self.globalProfile.export2anki
  ).reduce(
    (acc, cur) => {
      const [key, value] = cur
      if (typeof value !== "string") return acc
      if (key.includes(`modelName${option + 1}`)) {
        acc.modelName = value
      } else if (key.includes(`field${option + 1}`)) {
        const [k, v] = value.split(/\s*——\s*/)
        if (k)
          acc.fields[k] = renderTemplateOfNodeProperties(
            node,
            reverseEscape(v, true) ?? ""
          )
      }
      return acc
    },
    {
      modelName: "",
      fields: {} as Record<string, string>
    }
  )
  return {
    tags,
    deckName,
    fields,
    modelName
  }
}
export function genUrlScheme(note: AnkiNote, id: string) {
  const { profileName, allowRepeat, jumpBack } = self.globalProfile.export2anki
  const { modelName, deckName, fields, tags } = note
  const ankiUrl = "anki://x-callback-url/addnote?"
  const fieldsText = Object.entries(fields).reduce((acc, cur) => {
    const [key, value] = cur
    return `${acc}${acc ? "&" : ""}fld${key}=${value}`
  }, "")
  return `${ankiUrl}profile=${profileName}&type=${modelName}&deck=${deckName}&${fieldsText}${
    tags.length ? "&tags=" + tags.join("%20") : ""
  }${allowRepeat ? "&dupes=1" : ""}${
    jumpBack ? "&x-success=marginnote3app://note/" + id : ""
  }`
}

export const checker: Record<"field" | "modelName", ICheckMethod> = {
  async field({ input }) {
    const { ankiConnectAPI, exportMethod, showTemplate } =
      self.globalProfile.export2anki
    console.log(ankiConnectAPI)
    if (!input.includes("——")) throw "请务必用 —— 来隔开字段名及其内容"
    const [key, value] = input.split(/\s*——\s*/)
    if (!key) throw "没有输入字段名"
    if (
      showTemplate[0] &&
      ankiConnectAPI &&
      exportMethod[0] === ExportMethod.API
    ) {
      const modelName =
        self.globalProfile.export2anki["modelName" + showTemplate[0]]
      const anki = new AnkiConnect(ankiConnectAPI)
      if (modelName) {
        const res = await anki.getModelFieldNames(modelName)
        if (!res.result?.includes(key))
          throw `输入错误，模版 ${modelName} 中没有此字段`
      }
    }
  },
  async modelName({ input }) {
    const { ankiConnectAPI, exportMethod } = self.globalProfile.export2anki
    if (exportMethod[0] === ExportMethod.API && ankiConnectAPI) {
      const anki = new AnkiConnect(ankiConnectAPI)
      const res = await anki.getModelList()
      if (!res.result?.includes(input)) throw `输入错误，Anki 中没有此模板`
    }
  }
}
