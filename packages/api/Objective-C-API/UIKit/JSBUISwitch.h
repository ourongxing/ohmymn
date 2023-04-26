#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIControl;

@protocol JSBUISwitch <JSExport, JSBUIControl>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, retain) UIColor *onTintColor;
@property (nonatomic, getter = isOn) BOOL on;

- (void)setOn:(BOOL)on animated:(BOOL)animated;

#pragma clang diagnostic pop

@end
