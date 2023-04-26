#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIView;

@protocol JSBUILabel <JSExport, JSBUIView>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, copy) NSString *text;
@property (nonatomic, copy) NSAttributedString *attributedText;
@property (nonatomic, strong) id<JSBUIFont> font;
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, strong) UIColor *highlightedTextColor;
@property (nonatomic, strong) UIColor *shadowColor;
@property (nonatomic) CGSize shadowOffset;
@property (nonatomic) UITextAlignment textAlignment;
@property (nonatomic) UILineBreakMode lineBreakMode;
@property (nonatomic, getter=isEnabled) BOOL enabled;
@property (nonatomic) NSInteger numberOfLines;                    // currently only supports 0 or 1
@property (nonatomic) UIBaselineAdjustment baselineAdjustment;    // not implemented
@property (nonatomic) BOOL adjustsFontSizeToFitWidth;            // not implemented
@property (nonatomic) CGFloat minimumFontSize;                    // not implemented
@property (nonatomic) CGFloat minimumScaleFactor;                    // not implemented
@property (nonatomic) BOOL topAlign;                    // not implemented
@property (nonatomic, getter=isHighlighted) BOOL highlighted;

- (CGRect)textRectForBounds:(CGRect)bounds limitedToNumberOfLines:(NSInteger)numberOfLines;
- (void)drawTextInRect:(CGRect)rect;

#pragma clang diagnostic pop

@end
