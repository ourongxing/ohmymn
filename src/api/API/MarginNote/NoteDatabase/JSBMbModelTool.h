#import "MbModelTool.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBMbModelTool <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

#pragma clang diagnostic pop
+ (MbModelTool *)sharedInstance;
JSExportAs(getNotebookById,
- (id)getTopicFromId:(NSString*)topicid);
JSExportAs(getMediaByHash,
- (NSData*)getMediaFromHash:(NSString*)hash);
JSExportAs(getNoteById,
- (id)getNoteFromId:(NSString*)noteid);
JSExportAs(getDocumentById,
- (id)getBookFromMd5:(NSString*)md5);
JSExportAs(getFlashcardByNoteId,
- (id)getNoteByEvernoteId:(NSString*)noteid topicid:(NSString*)topicid);
JSExportAs(getFlashcardsByNoteId,
- (NSArray*)getNotesByEvernoteId:(NSString*)noteid);
JSExportAs(hasFlashcardByNoteId,
- (BOOL)hasNotesForEvernoteId:(NSString*)noteid);
- (void)savedb;
- (NSArray *)allNotebooks;
- (NSArray*)allDocuments;
JSExportAs(setNotebookSyncDirty,
- (void)setTopicDirty:(NSString*)topicid);
- (NSArray*)saveHistoryArchive:(NSString*)topicid key:(NSString*)key;
- (NSArray*)loadHistoryArchive:(NSString*)topicid key:(NSString*)key;
- (void)deleteBookNote:(NSString*)noteid;
- (void)deleteBookNoteTree:(NSString*)noteid;
- (NSArray*)cloneNotes:(NSArray*)notes toTopic:(NSString*)topicid;
- (NSArray*)cloneNotesToFlashcards:(NSArray*)notes toTopic:(NSString*)topicid;
- (BOOL)exportNotebook:(NSString*)topicid storePath:(NSString*)storePath;
- (id)importNotebookFromStorePath:(NSString*)storePath merge:(BOOL)merge;
@end
