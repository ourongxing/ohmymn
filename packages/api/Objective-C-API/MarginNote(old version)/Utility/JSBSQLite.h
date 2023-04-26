#import "JSBNSObject.h"
#import "FMDatabase.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBSQLiteDatabase <JSExport,JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (atomic, assign) BOOL traceExecution;
@property (atomic, assign) BOOL checkedOut;
@property (atomic, assign) BOOL crashOnErrors;
@property (atomic, assign) BOOL logsErrors;
@property (atomic, retain) NSMutableDictionary *cachedStatements;
+ (instancetype)databaseWithPath:(NSString*)inPath;
- (instancetype)initWithPath:(NSString*)inPath;
- (BOOL)open;
- (BOOL)close;
- (BOOL)goodConnection;
- (BOOL)executeUpdate:(NSString*)sql withArgumentsInArray:(NSArray *)arguments;
- (BOOL)executeUpdate:(NSString*)sql withParameterDictionary:(NSDictionary *)arguments;
- (BOOL)executeStatements:(NSString *)sql;
- (int)changes;
- (FMResultSet *)executeQuery:(NSString *)sql withArgumentsInArray:(NSArray *)arguments;
- (FMResultSet *)executeQuery:(NSString *)sql withParameterDictionary:(NSDictionary *)arguments;
- (BOOL)beginTransaction;
- (BOOL)beginDeferredTransaction;
- (BOOL)commit;
- (BOOL)rollback;
- (BOOL)inTransaction;
- (void)clearCachedStatements;
- (void)closeOpenResultSets;
- (BOOL)hasOpenResultSets;
- (BOOL)shouldCacheStatements;
- (void)setShouldCacheStatements:(BOOL)value;
- (BOOL)setKey:(NSString*)key;
- (BOOL)rekey:(NSString*)key;
- (BOOL)setKeyWithData:(NSData *)keyData;
- (BOOL)rekeyWithData:(NSData *)keyData;
- (NSString *)databasePath;
- (NSString*)lastErrorMessage;
- (int)lastErrorCode;
- (BOOL)hadError;
- (NSError*)lastError;
- (void)setMaxBusyRetryTimeInterval:(NSTimeInterval)timeoutInSeconds;
- (NSTimeInterval)maxBusyRetryTimeInterval;
+ (BOOL)isSQLiteThreadSafe;
+ (NSString*)sqliteLibVersion;
+ (NSString*)FMDBUserVersion;
+ (SInt32)FMDBVersion;
+ (NSDateFormatter *)storeableDateFormat:(NSString *)format;
- (BOOL)hasDateFormatter;
- (void)setDateFormat:(NSDateFormatter *)format;
- (NSDate *)dateFromString:(NSString *)s;
- (NSString *)stringFromDate:(NSDate *)date;
#pragma clang diagnostic pop

@end

@protocol JSBSQLiteResultSet <JSExport>
@property (atomic, retain) NSString *query;
@property (readonly) NSMutableDictionary *columnNameToIndexMap;
@property (atomic, retain) FMStatement *statement;
+ (instancetype)resultSetWithStatement:(FMStatement *)statement usingParentDatabase:(FMDatabase*)aDB;
- (void)close;
- (void)setParentDB:(FMDatabase *)newDb;
- (BOOL)next;
- (BOOL)nextWithError:(NSError **)outErr;
- (BOOL)hasAnotherRow;
- (int)columnCount;
- (int)columnIndexForName:(NSString*)columnName;
- (NSString*)columnNameForIndex:(int)columnIdx;
- (int)intForColumn:(NSString*)columnName;
- (int)intForColumnIndex:(int)columnIdx;
- (long)longForColumn:(NSString*)columnName;
- (long)longForColumnIndex:(int)columnIdx;
- (long long int)longLongIntForColumn:(NSString*)columnName;
- (long long int)longLongIntForColumnIndex:(int)columnIdx;
- (unsigned long long int)unsignedLongLongIntForColumn:(NSString*)columnName;
- (unsigned long long int)unsignedLongLongIntForColumnIndex:(int)columnIdx;
- (BOOL)boolForColumn:(NSString*)columnName;
- (BOOL)boolForColumnIndex:(int)columnIdx;
- (double)doubleForColumn:(NSString*)columnName;
- (double)doubleForColumnIndex:(int)columnIdx;
- (NSString*)stringForColumn:(NSString*)columnName;
- (NSString*)stringForColumnIndex:(int)columnIdx;
- (NSDate*)dateForColumn:(NSString*)columnName;
- (NSDate*)dateForColumnIndex:(int)columnIdx;
- (NSData*)dataForColumn:(NSString*)columnName;
- (NSData*)dataForColumnIndex:(int)columnIdx;
- (id)objectForColumnName:(NSString*)columnName;
- (id)objectForColumnIndex:(int)columnIdx;
- (id)objectForKeyedSubscript:(NSString *)columnName;
- (id)objectAtIndexedSubscript:(int)columnIdx;
- (BOOL)columnIndexIsNull:(int)columnIdx;
- (BOOL)columnIsNull:(NSString*)columnName;
- (NSDictionary*)resultDictionary;
- (void)kvcMagic:(id)object;
@end

@protocol JSBSQLiteStatement<JSExport>
@property (atomic, assign) long useCount;
@property (atomic, retain) NSString *query;
@property (atomic, assign) BOOL inUse;
- (void)close;
- (void)reset;
@end
