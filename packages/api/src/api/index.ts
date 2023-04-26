export * from "./Foundation"
export * from "./MarginNote"
export * from "./UIKit"

declare global {
  const JSB: {
    defineClass(
      declaration: string,
      instanceMethods?: object,
      classMethods?: object
    ): any
    require(name: string): any
    log(format: string, arguments: string[] | string): void
    dump(object: any): void
    newAddon(mainPath: string): any
  }
}

export declare type DictObj = {
  [k: string]: any
}
