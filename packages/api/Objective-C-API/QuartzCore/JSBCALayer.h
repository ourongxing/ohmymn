#import <QuartzCore/CALayer.h>

@import QuartzCore;
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBCALayer <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (readonly) CGRect visibleRect;
@property CGRect bounds;
@property CGPoint position;
@property CGFloat zPosition;
@property CGPoint anchorPoint;
@property CGFloat anchorPointZ;
@property CGRect frame;
@property(getter=isHidden) BOOL hidden;
@property(getter=isDoubleSided) BOOL doubleSided;
@property(getter=isGeometryFlipped) BOOL geometryFlipped;
@property(nullable, readonly) CALayer *superlayer;
@property(nullable, copy) NSArray<__kindof CALayer *> *sublayers;
@property(nullable, strong) __kindof CALayer *mask;
@property BOOL masksToBounds;
@property(nullable, strong) id contents;
@property CGRect contentsRect;
@property CGFloat contentsScale;
@property CGRect contentsCenter;
@property float minificationFilterBias;
@property(getter=isOpaque) BOOL opaque;
@property BOOL allowsEdgeAntialiasing;
@property(nullable,getter=_backgroundColor,setter=_setBackgroundColor:) UIColor* backgroundColor;
@property CGFloat cornerRadius;
@property CGFloat borderWidth;
@property(nullable,getter=_borderColor,setter=_setBorderColor:) UIColor* borderColor;
@property float opacity;
@property(nullable, strong) id compositingFilter;
@property(nullable, copy) NSArray *filters;
@property(nullable, copy) NSArray *backgroundFilters;
@property BOOL shouldRasterize;
@property CGFloat rasterizationScale;
@property(nullable,getter=_shadowColor,setter=_setShadowColor:) UIColor* shadowColor;
@property float shadowOpacity;
@property CGSize shadowOffset;
@property CGFloat shadowRadius;

+ (id)layer;
+ (id)defaultValueForKey:(NSString *)key;
+ (BOOL)needsDisplayForKey:(NSString *)key;
+ (id <CAAction>)defaultActionForKey:(NSString *)event;

- (void)scrollPoint:(CGPoint)p;
- (void)scrollRectToVisible:(CGRect)r;
- (id)init;
- (id)presentationLayer;
- (id)modelLayer;
- (BOOL)shouldArchiveValueForKey:(NSString *)key;
- (CGAffineTransform)affineTransform;
- (void)setAffineTransform:(CGAffineTransform)m;
- (BOOL)contentsAreFlipped;
- (void)removeFromSuperlayer;
- (void)addSublayer:(CALayer *)layer;
- (void)insertSublayer:(CALayer *)layer atIndex:(unsigned)idx;
- (void)insertSublayer:(CALayer *)layer below:(CALayer *)sibling;
- (void)insertSublayer:(CALayer *)layer above:(CALayer *)sibling;
- (void)replaceSublayer:(CALayer *)layer with:(CALayer *)layer2;
- (CGPoint)convertPoint:(CGPoint)p fromLayer:(CALayer *)l;
- (CGPoint)convertPoint:(CGPoint)p toLayer:(CALayer *)l;
- (CGRect)convertRect:(CGRect)r fromLayer:(CALayer *)l;
- (CGRect)convertRect:(CGRect)r toLayer:(CALayer *)l;
- (CFTimeInterval)convertTime:(CFTimeInterval)t fromLayer:(CALayer *)l;
- (CFTimeInterval)convertTime:(CFTimeInterval)t toLayer:(CALayer *)l;
- (CALayer *)hitTest:(CGPoint)p;
- (BOOL)containsPoint:(CGPoint)p;
- (void)display;
- (void)setNeedsDisplay;
- (void)setNeedsDisplayInRect:(CGRect)r;
- (BOOL)needsDisplay;
- (void)displayIfNeeded;
- (void)drawInContext:(id)ctx;
- (void)renderInContext:(id)ctx;
- (CGSize)preferredFrameSize;
- (void)setNeedsLayout;
- (BOOL)needsLayout;
- (void)layoutIfNeeded;
- (void)layoutSublayers;
- (id <CAAction>)actionForKey:(NSString *)event;
- (void)addAnimation:(CAAnimation *)anim forKey:(NSString *)key;
- (void)removeAllAnimations;
- (void)removeAnimationForKey:(NSString *)key;
- (NSArray *)animationKeys;
- (CAAnimation *)animationForKey:(NSString *)key;

#pragma clang diagnostic pop

@end
