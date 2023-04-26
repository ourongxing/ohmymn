#import "MbAppDelegate.h"
#import "JSBMbBookNote.h"
@import Foundation;
@import JavaScriptCore;
@class MindMapNote;
@class MbBookNote;

@protocol JSBMindMapNode <JSExport>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic,readonly) MbBookNote * note;
@property (nonatomic,readonly,getter=parentNote) MindMapNote* parentNode;
@property (nonatomic,readonly) NSArray* summaryLinks;
@property (nonatomic,readonly,getter=childNotes) NSArray* childNodes;
@property (nonatomic,readonly) CGRect frame;

#pragma clang diagnostic pop

@end
