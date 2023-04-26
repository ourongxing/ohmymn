#import "MbAppDelegate.h"
@import Foundation;
@import JavaScriptCore;
#import <UIKit/UIKit.h>

@protocol JSBJSExtension <JSExport>
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@property (nonatomic,readonly) UIWindow * window;
- (void)sceneWillConnect;
- (void)sceneDidDisconnect;
- (void)sceneWillResignActive;
- (void)sceneDidBecomeActive;
- (void)notebookWillOpen:(NSString*)topicid;
- (void)notebookWillClose:(NSString*)topicid;
- (void)documentDidOpen:(NSString*)docmd5;
- (void)documentWillClose:(NSString*)docmd5;
- (NSDictionary*)queryAddonCommandStatus;
- (NSArray*)additionalTitleLinksOfNotebook:(NSString*)topicid;
- (UIViewController*)viewControllerForTitleLink:(NSString*)titleLink;
- (void)controllerWillLayoutSubviews:(UIViewController*)controller;
- (NSArray*)additionalShortcutKeys;
- (NSDictionary*)queryShortcutKey:(NSString*)command withKeyFlags:(NSInteger)keyFlags;
- (void)processShortcutKey:(NSString*)command withKeyFlags:(NSInteger)keyFlags;
+ (void)addonDidConnect;
+ (void)addonWillDisconnect;
+ (void)applicationDidEnterBackground;
+ (void)applicationWillEnterForeground;
+ (void)applicationDidReceiveLocalNotification:(UILocalNotification*)notify;
#pragma clang diagnostic pop

@end
