#import "MbBookNote.h"

@import Foundation;
@import JavaScriptCore;
@class MbTopic;
@class MbBook;
@protocol JSBMbBookNote <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic,readwrite,getter=highlight_text,setter=_setHighlightText:) NSString * excerptText;
@property (nonatomic,readwrite,getter=notetitle,setter=_setNoteTitle:) NSString * noteTitle;
@property (nonatomic,readwrite,getter=highStyleColorType,setter=_setHighStyleColorType:) int colorIndex;
@property (nonatomic,readwrite,getter=highStyleFillType,setter=_setHighStyleFillType:) int fillIndex;
@property (nonatomic,readwrite) CGPoint mindmapPosition;

@property (nonatomic,readonly,getter=noteid) NSString * noteId;
@property (nonatomic,readonly,getter=bookmd5) NSString * docMd5;
@property (nonatomic,readonly,getter=topicid) NSString * notebookId;
@property (nonatomic,readonly,getter=startpage) NSNumber * startPage;
@property (nonatomic,readonly,getter=endpage) NSNumber * endPage;
@property (nonatomic,readonly,getter=startpos) NSString * startPos;
@property (nonatomic,readonly,getter=endpos) NSString * endPos;
@property (nonatomic,readonly,getter=highlight_pic) NSDictionary * excerptPic;
@property (nonatomic,readonly,getter=highlight_date) NSDate * createDate;
@property (nonatomic,readonly,getter=note_date) NSDate * modifiedDate;
@property (nonatomic,readonly,getter=media_list) NSString * mediaList;
@property (nonatomic,readonly,getter=evernoteid) NSString * originNoteId;
@property (nonatomic,readonly,getter=mindclose) NSNumber * mindmapBranchClose;
@property (nonatomic,readonly,getter=notes_text) NSString * notesText;
@property (nonatomic,readonly,getter=groupnoteid) NSString * groupNoteId;

@property (nonatomic,readonly,getter=comments) NSArray * comments;

@property (nonatomic,readonly) MbBookNote * parentNote;
@property (nonatomic,readonly,getter=linkNotes) NSArray * linkedNotes;
@property (nonatomic,readonly,getter=childNotes) NSArray * childNotes;
@property (nonatomic,readonly,getter=summaryLinks) NSArray * summaryLinks;

@property (nonatomic,readonly) NSNumber * zLevel;
@property (nonatomic,readonly) NSNumber * hidden;
@property (nonatomic,readonly) NSNumber * toc;
@property (nonatomic,readonly) NSNumber * annotation;
@property (nonatomic,readonly) NSNumber * textFirst;
@property (nonatomic,readonly) NSNumber * groupMode;
@property (nonatomic,readonly) NSNumber * flashcard;
@property (nonatomic,readonly,getter=hasSummaryLinks) BOOL summary;
@property (nonatomic,readonly) NSNumber * flagged;
@property (nonatomic,readonly) NSDictionary * textHighlight;
@property (nonatomic,readonly) NSDictionary * options;

- (void)paste;
- (void)clearFormat;
- (NSString*) allNoteText;
JSExportAs(merge,
- (void) addNoteLink:(MbBookNote*)note);
JSExportAs(appendHtmlComment,
- (void)appendHtmlComment:(NSString*)html text:(NSString*)text tag:(NSString*)tag);
- (void)appendTextComment:(NSString*)text;
- (void)appendNoteLink:(MbBookNote*)note;
- (void)removeCommentByIndex:(NSInteger)index;
+ (MbBookNote *)createWithTitle:(NSString *)title notebook:(MbTopic*)topic document:(MbBook*)book;

#pragma clang diagnostic pop
@end
