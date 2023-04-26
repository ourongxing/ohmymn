#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBUIViewController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBUndoManager <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
+ (id<JSBUndoManager>)sharedInstance;
JSExportAs(undoGrouping,
- (void)undoGrouping:(NSString*)actionName inNotebook:(NSString*)topicid block:(JSValue*)block);
- (void)undo;
- (void)redo;
- (BOOL)canUndo;
- (BOOL)canRedo;
- (void)clearAll;

#pragma clang diagnostic pop

@end
