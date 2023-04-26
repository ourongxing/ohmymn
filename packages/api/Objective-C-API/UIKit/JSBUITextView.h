#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIScrollView;

@protocol JSBUITextView <JSExport, JSBUIScrollView>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, readonly) NSLayoutManager *layoutManager;
@property (nonatomic, assign) UIEdgeInsets textContainerInset;
@property (nonatomic, retain) UIColor *textColor;
@property (nonatomic, readonly, retain) NSTextStorage *textStorage;
@property (nonatomic) BOOL allowsEditingTextAttributes;
@property (nonatomic) NSTextAlignment textAlignment;
@property (nonatomic, getter = isSelectable) BOOL selectable;
@property (nonatomic, readonly) NSTextContainer *textContainer;
@property (nonatomic) NSRange selectedRange;
@property (nonatomic, retain) id<JSBUIFont> font;
@property (nonatomic) UIDataDetectorTypes dataDetectorTypes;
@property (nonatomic, copy) NSDictionary *typingAttributes;
@property (nonatomic, copy) NSString *text;
@property (nonatomic, getter = isEditable) BOOL editable;
@property (nonatomic, copy) NSAttributedString *attributedText;

- (void)scrollRangeToVisible:(NSRange)range;
- (instancetype)initWithFrame:(CGRect)frame textContainer:(NSTextContainer *)textContainer;

#pragma clang diagnostic pop

@end
