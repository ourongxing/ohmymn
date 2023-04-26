#import "MbAppDelegate.h"
#import "JSBUITableView.h"
#import "JSBMindMapNode.h"
@import Foundation;
@import JavaScriptCore;
@class MbBookNote;

@protocol JSBOutlineView <JSExport, JSBUITableView>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
- (MbBookNote*)noteFromIndexPath:(NSIndexPath*)indexPath;
#pragma clang diagnostic pop

@end
