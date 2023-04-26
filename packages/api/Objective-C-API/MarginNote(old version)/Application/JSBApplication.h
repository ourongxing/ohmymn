#import "MbAppDelegate.h"
#import "JSBStudyController.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBApplication <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

+ (id<MbAppDelegate>)sharedInstance;
@property (nonatomic, readonly) NSString * currentTheme;
@property (nonatomic, readonly) UIColor* defaultTintColorForDarkBackground;
@property (nonatomic, readonly) UIColor* defaultTintColorForSelected;
@property (nonatomic, readonly) UIColor* defaultTintColor;
@property (nonatomic, readonly) UIColor* defaultBookPageColor;
@property (nonatomic, readonly) UIColor* defaultNotebookColor;
@property (nonatomic, readonly) UIColor* defaultTextColor;
@property (nonatomic, readonly) UIColor* defaultDisableColor;
@property (nonatomic, readonly) UIColor* defaultHighlightBlendColor;
@property (nonatomic, readonly, getter=window) UIWindow* focusWindow;
@property (nonatomic, readonly) NSString *dbPath;
@property (nonatomic, readonly) NSString *documentPath;
@property (nonatomic, readonly) NSString *cachePath;
@property (nonatomic, readonly) NSString *tempPath;
@property (nonatomic, readonly) NSInteger osType; //0: iPadOS 1: iPhoneOS 2: macOS

- (void)refreshAfterDBChanged:(NSString*)topicid;
JSExportAs(queryCommandWithKeyFlagsInWindow,
- (NSDictionary*)queryCommandStatus:(NSString*)command withKeyFlags:(NSInteger)keyFlags inWindow:(UIWindow*)window);
- (void)processCommand:(NSString*)command withKeyFlags:(NSInteger)keyFlags inWindow:(UIWindow*)window;
- (void)openURL:(NSURL*)url;
- (void)alert:(NSString*)message;
JSExportAs(showHUD,
- (void)showHUD:(NSString*)message onView:(UIView*)view withDuration:(double)duration);
- (void)waitHUD:(NSString*)message onView:(UIView*)view;
- (void)stopWaitHUDOnView:(UIView*)view;
- (void)saveFile:(NSString*)mfile withUti:(NSString*)uti;
JSExportAs(studyController,
- (id<JSBStudyController>)studyboardController:(UIWindow*)window);
JSExportAs(checkNotifySenderInWindow,
- (BOOL)checkObject:(id)obj inWindow:(UIWindow*)window);
JSExportAs(openFileWithUTIs,
- (void)openFileWithUTIs:(NSArray<NSString*>*)types viewController:(UIViewController*)controller block:(JSValue*)block);
JSExportAs(regsiterHtmlCommentEditor,
- (void)regsiterHtmlCommentEditor:(NSDictionary*)commentEditor htmlEditor:(JSValue*)htmlEditor htmlRender:(JSValue*)htmlRender withCommentTag:(NSString*)commentTag);
JSExportAs(unregsiterHtmlCommentEditor,
- (void)unregsiterHtmlCommentEditorWithCommentTag:(NSString *)commentTag);

#pragma clang diagnostic pop

@end
