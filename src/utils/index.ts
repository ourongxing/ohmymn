const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
export { deepCopy, unique }
