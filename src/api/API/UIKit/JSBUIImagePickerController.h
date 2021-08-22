#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUINavigationController;

@protocol JSBUIImagePickerController <JSExport, JSBUINavigationController>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic) NSTimeInterval videoMaximumDuration;
@property (nonatomic, copy) NSArray *mediaTypes;
@property (nonatomic) UIImagePickerControllerSourceType sourceType;
@property (nonatomic) BOOL allowsEditing;
@property (nonatomic, retain) UIView *cameraOverlayView;
@property (nonatomic) BOOL allowsImageEditing;
@property (nonatomic) CGAffineTransform cameraViewTransform;
@property (nonatomic) BOOL showsCameraControls;

+ (BOOL)isSourceTypeAvailable:(UIImagePickerControllerSourceType)sourceType;
+ (NSArray *)availableMediaTypesForSourceType:(UIImagePickerControllerSourceType)sourceType;

- (void)takePicture;
- (BOOL)startVideoCapture;
- (void)stopVideoCapture;

#pragma clang diagnostic pop

@end
