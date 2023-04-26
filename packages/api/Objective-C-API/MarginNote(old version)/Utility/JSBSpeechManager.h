#import "MbAppDelegate.h"

@import Foundation;
@import JavaScriptCore;

@class SpeechManager;

@protocol JSBSpeechManager <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
- (void)startSpeechNotes:(NSArray*)notes;
- (void)stopSpeech;
- (void)pauseSpeech;
- (void)continueSpeech;
- (void)prevSpeech;
- (void)nextSpeech;
- (BOOL)canPrev;
- (BOOL)canNext;
- (void)playText:(NSString*)text;
- (void)playText:(NSString *)text languageTxt:(NSString*)languageTxt;
@property (nonatomic,readonly) BOOL speaking;
@property (nonatomic,readonly) BOOL paused;
@property (nonatomic,weak) UIWindow * sceneWindow;
@property (nonatomic,strong) NSString * languageCode;
+ (SpeechManager *)sharedInstance;

#pragma clang diagnostic pop

@end
