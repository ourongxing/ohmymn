export enum ActionKey {
  exportCard2Anki
}

export const enum ExportMethod {
  URL,
  API
}

export const enum AddTags {
  None,
  CardTags,
  Custom
}

export const enum AutoSync {
  None,
  OnlyiPad,
  Both
}

export interface AnkiNote {
  deckName: string
  modelName: string
  fields: Record<string, string>
  tags: string[]
}
