export {}
declare global {
  class SQLiteDatabase {
    static databaseWithPath(path: string): SQLiteDatabase
    open(): boolean
    close(): boolean
    executeQueryWithArgumentsInArray(sql: string, args: any[]): SQLiteResultSet
  }
  class SQLiteResultSet {
    stringForColumn(columnName: string): string
    next(): boolean
    close(): void
    resultDictionary(): DictObj
  }
}
