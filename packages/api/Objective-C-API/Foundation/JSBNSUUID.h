#import <Foundation/NSObject.h>
#include<CoreFoundation/CFUUID.h>
#include<uuid/uuid.h>

@import Foundation;
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSUUID <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

+ (id)UUID;

- (void)getUUIDBytes:(uuid_t)uuid;
- (NSString *)UUIDString;

#pragma clang diagnostic pop

@end
