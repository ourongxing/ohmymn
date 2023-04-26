#import <Foundation/NSObject.h>

@import Foundation;
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSError <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

+ (id)errorWithDomain:(NSString *)domain code:(NSInteger)code userInfo:(NSDictionary *)dict;

- (id)initWithDomain:(NSString *)domain code:(NSInteger)code userInfo:(NSDictionary *)dict;
@property (nonatomic,readonly) NSString *domain;
@property (nonatomic,readonly) NSInteger code;
@property (nonatomic,readonly) NSDictionary *userInfo;
@property (nonatomic,readonly) NSString *localizedDescription;
@property (nonatomic,readonly) NSString *localizedFailureReason;
@property (nonatomic,readonly) NSString *localizedRecoverySuggestion;
@property (nonatomic,readonly) NSArray *localizedRecoveryOptions;
- (id)recoveryAttempter;
@property (nonatomic,readonly) NSString *helpAnchor;

#pragma clang diagnostic pop

@end
