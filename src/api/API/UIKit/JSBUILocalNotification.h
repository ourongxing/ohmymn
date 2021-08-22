#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUILocalNotification <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, copy) NSTimeZone *timeZone;
@property (nonatomic, copy) NSDictionary *userInfo;
@property (nonatomic, copy) NSString *alertBody;
@property (nonatomic, copy) NSString *soundName;
@property (nonatomic, copy) NSDate *fireDate;

#pragma clang diagnostic pop

@end
