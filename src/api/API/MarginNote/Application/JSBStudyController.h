#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBUIViewController.h"
#import "JSBNotebookController.h"
#import "JSBReaderController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBStudyController <JSExport,JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic,readonly) int studyMode; //0 & 1: doc mode 2: study mode 3: review mode
@property (nonatomic,readonly,getter=isNarrowMode) BOOL narrowMode; //when narrowmode, book split mode 1 is disabled
@property (nonatomic,assign,getter=bookSplitMode,setter=setBookSplitMode:) int docMapSplitMode; //0: all map 1:half map half doc 2: all doc
@property (nonatomic,assign) BOOL rightMapMode;
@property (nonatomic,readonly,getter=fSearchViewController) id<JSBNotebookController> notebookController;
@property (nonatomic,readonly,getter=detailController) id<JSBReaderController> readerController;

- (void)focusNoteInMindMapById:(NSString*)noteId;
- (void)focusNoteInDocumentById:(NSString*)noteId;
- (void)refreshAddonCommands;

#pragma clang diagnostic pop

@end
