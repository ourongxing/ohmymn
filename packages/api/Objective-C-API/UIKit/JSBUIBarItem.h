#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBUIBarItem <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, getter = isEnabled) BOOL enabled;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, retain) UIImage *image;
@property (nonatomic) NSInteger tag;
@property (nonatomic) UIEdgeInsets imageInsets;
@property (nonatomic) UIEdgeInsets landscapeImagePhoneInsets;
@property (nonatomic, retain) UIImage *landscapeImagePhone;

- (void)setTitleTextAttributes:(NSDictionary *)attributes forState:(UIControlState)state;
- (NSDictionary *)titleTextAttributesForState:(UIControlState)state;

#pragma clang diagnostic pop

@end
