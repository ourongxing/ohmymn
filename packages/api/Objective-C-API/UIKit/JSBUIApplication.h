#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIResponder;

@protocol JSBUIApplication <JSExport, JSBUIResponder>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

//@property (nonatomic, readonly) UIUserInterfaceLayoutDirection userInterfaceLayoutDirection;
@property (nonatomic, getter = isIdleTimerDisabled) BOOL idleTimerDisabled;
@property (nonatomic) BOOL applicationSupportsShakeToEdit;
@property (nonatomic, readonly) UIApplicationState applicationState;
@property (nonatomic, getter = isNetworkActivityIndicatorVisible) BOOL networkActivityIndicatorVisible;

+ (UIApplication *)sharedApplication;
//+ (void)registerObjectForStateRestoration:(id <UIStateRestoring>)object restorationIdentifier:(NSString *)restorationIdentifier;
- (BOOL)openURL:(NSURL *)url;
- (BOOL)canOpenURL:(NSURL *)url;
JSExportAs(openURLOptionsCompletionHandler,
- (void)_openURL:(NSURL*)url options:(NSDictionary *)options completionHandler:(JSValue*)completion);

//- (void)presentLocalNotificationNow:(UILocalNotification *)notification;
- (void)cancelLocalNotification:(UILocalNotification *)notification;
//- (void)cancelAllLocalNotifications;
- (void)scheduleLocalNotification:(UILocalNotification *)notification;  // copies notification
@property(nonatomic,copy, readonly) NSArray<UILocalNotification *> *scheduledLocalNotifications;

#pragma clang diagnostic pop

@end
