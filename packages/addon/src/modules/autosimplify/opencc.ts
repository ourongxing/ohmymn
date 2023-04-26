export class OpenCC {
  private dict!: any
  private cache: any = {}
  constructor(dict: any) {
    this.dict = dict
  }
  private getDictionary(name: string, options: { reverse?: boolean } = {}) {
    const { reverse } = options
    const cacheName = reverse ? `R_${name}` : name
    const dictionary = this.cache[cacheName]
    return (
      dictionary ||
      (this.cache[cacheName] = this.dict[name].reduce(
        (map: { [x: string]: any }, entry: any[]) => {
          const first = options.reverse ? 1 : 0
          map[entry[first]] = entry[1 - first]
          return map
        },
        {}
      ))
    )
  }
  private translate(text: string, dictionary: any) {
    const maxLength = Object.keys(dictionary).reduce(
      (maxLength, word) => Math.max(maxLength, word.length),
      0
    )
    const translated = []
    for (let i = 0, { length } = text; i < length; i++) {
      let found
      for (let j = maxLength; j > 0; j--) {
        const target = text.substr(i, j)
        if (Object.hasOwnProperty.call(dictionary, target)) {
          i += j - 1
          translated.push(dictionary[target])
          found = 1
          break
        }
      }
      !found && translated.push(text[i])
    }

    return translated.join("")
  }
  private convertChain(input: string, chains: any): string {
    return chains.reduce((input: any, chain: any) => {
      const dictionaries = chain.slice()
      dictionaries.splice(0, 0, {})
      return this.translate(input, Object.assign.apply(null, dictionaries))
    }, input)
  }
  traditionalToSimplified(text: string) {
    return this.convertChain(text, [
      [this.getDictionary("TSPhrases"), this.getDictionary("TSCharacters")]
    ])
  }
  hongKongToSimplified(text: string) {
    return this.convertChain(text, [
      [
        this.getDictionary("HKVariantsRevPhrases"),
        this.getDictionary("HKVariants", { reverse: true })
      ],
      [this.getDictionary("TSPhrases"), this.getDictionary("TSCharacters")]
    ])
  }
  taiwanToSimplified(text: string) {
    return this.convertChain(text, [
      [
        this.getDictionary("TWVariantsRevPhrases"),
        this.getDictionary("TWVariants", { reverse: true })
      ],
      [this.getDictionary("TSPhrases"), this.getDictionary("TSCharacters")]
    ])
  }
  taiwanToSimplifiedWithPhrases(text: string) {
    return this.convertChain(text, [
      [
        this.getDictionary("TWVariantsRevPhrases"),
        this.getDictionary("TWVariants", { reverse: true })
      ],
      [
        this.getDictionary("TWPhrasesIT", { reverse: true }),
        this.getDictionary("TWPhrasesName", { reverse: true }),
        this.getDictionary("TWPhrasesOther", { reverse: true })
      ],
      [this.getDictionary("TSPhrases"), this.getDictionary("TSCharacters")]
    ])
  }
}
