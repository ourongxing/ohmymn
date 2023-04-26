import { DictObj } from ".."

declare global {
  const SQLiteDatabase: {
    databaseWithPath(path: string): SQLiteDatabase
  }
}

export declare type SQLiteDatabase = {
  open(): boolean
  close(): boolean
  executeQueryWithArgumentsInArray(sql: string, args: any[]): SQLiteResultSet
}

export declare class SQLiteResultSet {
  stringForColumn(columnName: string): string
  next(): boolean
  close(): void
  resultDictionary(): DictObj
}
