#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUIPopoverController <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, retain) UIViewController *contentViewController;
@property (nonatomic) CGSize popoverContentSize;
@property (nonatomic, copy) NSArray *passthroughViews;
@property (nonatomic, readonly, getter = isPopoverVisible) BOOL popoverVisible;
@property (nonatomic, assign) id delegate;

JSExportAs(initWithContentViewController,
- (id)_initWithContentViewController:(UIViewController *)viewController);
- (void)setContentViewController:(UIViewController *)viewController animated:(BOOL)animated;
JSExportAs(presentPopoverFromRect,
- (void)presentPopoverFromRect:(CGRect)rect inView:(UIView *)view permittedArrowDirections:(UIPopoverArrowDirection)arrowDirections animated:(BOOL)animated);
JSExportAs(presentPopoverFromBarButtonItem,
- (void)presentPopoverFromBarButtonItem:(UIBarButtonItem *)item permittedArrowDirections:(UIPopoverArrowDirection)arrowDirections animated:(BOOL)animated);
- (void)dismissPopoverAnimated:(BOOL)animated;

#pragma clang diagnostic pop

@end

