#import <Foundation/NSObject.h>

@import Foundation;
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSNotificationCenter <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

+ (instancetype)defaultCenter;

- (instancetype)init;
JSExportAs(addObserverSelectorName,
- (void)_addObserver:(id)observer selector:(NSString*)aSelector name:(NSString *)aName);
- (void)postNotification:(NSNotification *)notification;
- (void)postNotificationName:(NSString *)aName object:(id)anObject;
- (void)postNotificationName:(NSString *)aName object:(id)anObject userInfo:(NSDictionary *)aUserInfo;
- (void)removeObserver:(id)observer;
JSExportAs(removeObserverName,
- (void)_removeObserver:(id)observer name:(NSString *)aName);

#pragma clang diagnostic pop

@end
