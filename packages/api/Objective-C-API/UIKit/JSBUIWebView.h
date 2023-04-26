#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIView;

@protocol JSBUIWebView <JSExport, JSBUIView>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic, readonly, getter = canGoForward) BOOL canGoForward;
@property (nonatomic, readonly, retain) UIScrollView *scrollView;
@property (nonatomic, readonly, getter = canGoBack) BOOL canGoBack;
@property (nonatomic) BOOL scalesPageToFit;
@property (nonatomic, assign) id delegate;
@property (nonatomic) UIDataDetectorTypes dataDetectorTypes;
@property (nonatomic, readonly, retain) NSURLRequest *request;
@property (nonatomic, readonly, getter = isLoading) BOOL loading;
@property (nullable, nonatomic, copy) NSString *customUserAgent;

- (void)loadRequest:(NSURLRequest *)request;
- (void)loadHTMLString:(NSString *)string baseURL:(NSURL *)baseURL;
- (void)loadData:(NSData *)data MIMEType:(NSString *)MIMEType textEncodingName:(NSString *)textEncodingName baseURL:(NSURL *)baseURL;
- (void)loadFileURL:(NSURL *)URL allowingReadAccessToURL:(NSURL *)readAccessURL;
- (void)reload;
- (void)stopLoading;
- (void)goBack;
- (void)goForward;
//- (NSString *)stringByEvaluatingJavaScriptFromString:(NSString *)script;
JSExportAs(evaluateJavaScript,
- (void)_evaluateJavaScript:(NSString *)javaScriptString completionHandler:(JSValue*)completionHandler);
JSExportAs(takeSnapshotWithWidth,
- (void)_takeSnapshotWithWidth:(CGFloat)width completionHandler:(JSValue*)completionHandler);

#pragma clang diagnostic pop

@end
