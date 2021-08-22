#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIView;

@protocol JSBUIToolbar <JSExport, JSBUIView>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, assign) id delegate;
@property (nonatomic, copy) NSArray *items;
@property (nonatomic, assign, getter = isTranslucent) BOOL translucent;
@property (nonatomic, retain) UIColor *barTintColor;
@property (nonatomic) UIBarStyle barStyle;

- (void)setItems:(NSArray *)items animated:(BOOL)animated;

#pragma clang diagnostic pop

@end
