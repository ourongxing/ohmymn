export {}
declare global {
  class JSB {
    static defineClass(
      declaration: string,
      instanceMembers?: object,
      staticMembers?: object
    ): WrapperObj<any>
    static require(name: string): WrapperObj<any>
    static log(format: string, arguments: Array<string>): void
    static dump(object: WrapperObj<any>): void
    static newAddon(mainPath: string): any
  }
  type WrapperObj<T> = T
  type DictObj = {
    [k: string]: any
  }
}
