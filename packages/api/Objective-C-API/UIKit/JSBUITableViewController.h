#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIViewController;

@protocol JSBUITableViewController <JSExport, JSBUIViewController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic) BOOL clearsSelectionOnViewWillAppear;
@property (nonatomic, retain) UITableView *tableView;

- (id)initWithStyle:(UITableViewStyle)style;

#pragma clang diagnostic pop

@end
