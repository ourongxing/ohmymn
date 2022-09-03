export * from "./Foundation"
export * from "./MarginNote"
export * from "./Addon"
export * from "./UIKit"

declare global {
  class JSB {
    static defineClass(
      declaration: string,
      instanceMembers?: object,
      staticMembers?: object
    ): any
    static require(name: string): any
    static log(format: string, arguments: Array<string> | string): void
    static dump(object: any): void
    static newAddon(mainPath: string): any
  }
  type DictObj = {
    [k: string]: any
  }
}

export type Timer = {
  invalidate: () => void
}
