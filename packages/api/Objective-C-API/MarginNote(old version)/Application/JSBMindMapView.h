#import "MbAppDelegate.h"
#import "JSBUIScrollView.h"
#import "JSBMindMapNode.h"
@import Foundation;
@import JavaScriptCore;

@protocol JSBMindMapView <JSExport, JSBUIScrollView>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic,readonly) NSArray * mindmapNodes;
@property (nonatomic,readonly) NSArray * selViewLst;
#pragma clang diagnostic pop

@end
