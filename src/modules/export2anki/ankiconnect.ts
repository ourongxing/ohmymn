import { isOCNull, OCNull2null } from "utils/common"
import fetch from "utils/network"
import { AnkiNote } from "./typings"

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
