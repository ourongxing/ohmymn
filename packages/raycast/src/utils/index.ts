export * from "./date"
export * from "./applescript"
export * from "./raycast"

export function escape(str: string) {
  return str.replace(/[\\"]/g, "\\$&")
}

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
export const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value))
