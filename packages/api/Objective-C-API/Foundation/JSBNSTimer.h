#import <Foundation/NSObject.h>
#import <Foundation/NSDate.h>

@import Foundation;
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSTimer <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

JSExportAs(scheduledTimerWithTimeInterval,
+ (NSTimer *)_scheduledTimerWithTimeInterval:(NSTimeInterval)ti repeats:(BOOL)yesOrNo block:(JSValue*)block);

- (void)fire;
- (NSDate *)fireDate;
- (void)setFireDate:(NSDate *)date;
- (NSTimeInterval)timeInterval;
- (NSTimeInterval)tolerance;
- (void)setTolerance:(NSTimeInterval)tolerance;
- (void)invalidate;
- (BOOL)isValid;
- (id)userInfo;

#pragma clang diagnostic pop

@end
