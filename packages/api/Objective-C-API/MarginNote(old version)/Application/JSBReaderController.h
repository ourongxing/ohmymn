#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBUIViewController.h"
#import "JSBDocumentController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBReaderController <JSExport,JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic, readonly, getter=fBookViewController) id<JSBDocumentController> currentDocumentController;
@property (nonatomic, readonly, getter=bookViewControllers) NSMutableArray* documentControllers;

#pragma clang diagnostic pop

@end
