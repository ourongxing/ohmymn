#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBUIViewController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBDocumentController <JSExport,JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic, readonly, getter=currBook) MbBook* document;
@property (nonatomic, readonly, getter=currentBookMd5) NSString* docMd5;
@property (nonatomic, readonly, getter=currTopicId) NSString* notebookId;
@property (nonatomic, readonly, getter=focusNote) MbBookNote* focusNote;
@property (nonatomic, readonly, getter=visibleFocusNote) MbBookNote* visibleFocusNote;
@property (nonatomic, readonly, getter=selectionText) NSString* selectionText;

#pragma clang diagnostic pop

@end
