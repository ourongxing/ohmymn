export const enum FillWordInfo {
  None,
  Custom,
  Chinese
}

export interface Word {
  sw: string
  word: string
  translation?: string
  exchange?: string
  phonetic?: string
  definition?: string
  tag?: string
  // pos: "v:46/n:54"
  pos?: string
  collins?: number
  oxford?: number
  frq?: number
  bnc?: number
}

export interface Exchange {
  lemma?: string
  current?: string
  does?: string
  done?: string
  did?: string
  doing?: string
  s?: string
  er?: string
  est?: string
}
