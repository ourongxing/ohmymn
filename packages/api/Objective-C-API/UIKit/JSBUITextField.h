#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIControl;

@protocol JSBUITextField <JSExport, JSBUIControl>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, retain) UIImage *disabledBackground;
@property (nonatomic, assign) id delegate;
@property (nonatomic) BOOL clearsOnBeginEditing;
@property (nonatomic, retain) UIColor *textColor;
@property (nonatomic, retain) UIImage *background;
@property (nonatomic) CGFloat minimumFontSize;
@property (nonatomic, copy) NSString *placeholder;
@property (nonatomic) NSTextAlignment textAlignment;
@property (nonatomic) UITextFieldViewMode rightViewMode;
@property (nonatomic) BOOL adjustsFontSizeToFitWidth;
@property (nonatomic) UITextFieldViewMode clearButtonMode;
@property (nonatomic, retain) UIView *leftView;
@property (nonatomic) UITextFieldViewMode leftViewMode;
@property (nonatomic, retain) id<JSBUIFont> font;
@property (nonatomic) UITextBorderStyle borderStyle;
@property (nonatomic, readonly, getter = isEditing) BOOL editing;
@property (nonatomic, copy) NSString *text;
@property (nonatomic, retain) UIView *rightView;

- (CGRect)borderRectForBounds:(CGRect)bounds;
- (CGRect)textRectForBounds:(CGRect)bounds;
- (CGRect)placeholderRectForBounds:(CGRect)bounds;
- (CGRect)editingRectForBounds:(CGRect)bounds;
- (CGRect)clearButtonRectForBounds:(CGRect)bounds;
- (CGRect)leftViewRectForBounds:(CGRect)bounds;
- (CGRect)rightViewRectForBounds:(CGRect)bounds;
- (void)drawTextInRect:(CGRect)rect;
- (void)drawPlaceholderInRect:(CGRect)rect;

#pragma clang diagnostic pop

@end
