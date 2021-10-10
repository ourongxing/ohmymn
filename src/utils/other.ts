const isObject = (value: any) => {
  const type = typeof value
  return value !== null && (type === "object" || type === "function")
}

const mergeObj = (obj: any, src: any) => {
  if (!isObject(obj) || !isObject(src)) {
    return src === undefined ? obj : src
  }
  return Object.keys({
    ...obj,
    ...src
  }).reduce(
    (acc: any, key) => {
      acc[key] = mergeObj(obj[key], src[key])
      return acc
    },
    Array.isArray(obj) ? [] : {}
  )
}

export { isObject, mergeObj }
