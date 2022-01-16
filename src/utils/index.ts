const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
const unique = (arr: any[]) => Array.from(new Set(arr))
export { deepCopy, unique }
