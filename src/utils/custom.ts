import { unique } from "utils"
import { ReplaceParam, addFlags } from "./input"

const extractArray = (text: string, params: ReplaceParam[]) =>
  unique(
    params
      .filter(param => param.regexp.test(text))
      .map(param => {
        param.regexp = addFlags(param.regexp, "g")
        return text
          .match(param.regexp)!
          .map(item => item.replace(param.regexp, param.newSubStr))
      })
      .flat()
  )

export { extractArray }
