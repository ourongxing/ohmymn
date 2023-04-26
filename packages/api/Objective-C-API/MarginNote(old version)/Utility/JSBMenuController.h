#import "MbAppDelegate.h"
#import "JSBMindMapView.h"
#import "JSBUIViewController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBMenuController <JSExport,JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic,retain)    UITableView* menuTableView;
@property (nonatomic,retain)    NSArray* commandTable;
@property (nonatomic,retain)    NSArray* sections;
@property (nonatomic,assign)    int rowHeight;
@property (nonatomic,assign)    int secHeight;
@property (nonatomic,assign)    int fontSize;

#pragma clang diagnostic pop

@end
