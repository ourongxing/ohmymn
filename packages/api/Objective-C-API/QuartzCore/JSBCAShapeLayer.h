#import <QuartzCore/CALayer.h>

@import QuartzCore;
@import JavaScriptCore;

@protocol JSBCALayer;

@protocol JSBCAShapeLayer <JSExport, JSBCALayer>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property CGFloat miterLimit;
@property (copy) NSString *lineCap;
@property (copy) NSArray *lineDashPattern;
@property CGFloat lineDashPhase;
@property (nullable,getter=_fillColor,setter=_setFillColor:) id fillColor;
@property CGFloat strokeStart, strokeEnd;
@property (nullable,getter=_strokeColor,setter=_setStrokeColor:) id strokeColor;
@property (nullable,getter=_path,setter=_setPath:) id path;
@property (copy) NSString *fillRule;
@property (copy) NSString *lineJoin;
@property CGFloat lineWidth;

#pragma clang diagnostic pop

@end
