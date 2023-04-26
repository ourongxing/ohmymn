#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBOutlineView.h"
#import "JSBUIViewController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBNotebookController <JSExport,JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic,readonly) id<JSBOutlineView> outlineView;
@property (nonatomic,readonly,getter=noteMindMap) id<JSBMindMapView> mindmapView;
@property (nonatomic, readonly, getter=currTopic) NSString* notebookId;
@property (nonatomic, readonly, getter=focusNote) MbBookNote* focusNote;
@property (nonatomic, readonly, getter=visibleFocusNote) MbBookNote* visibleFocusNote;

#pragma clang diagnostic pop

@end
