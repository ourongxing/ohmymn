#import "MbBook.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBMbBook <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic,readonly,getter=currenttopicid) NSString * currentTopicId;
@property (nonatomic,readonly,getter=lastvisit) NSDate * lastVisit;
@property (nonatomic,readonly,getter=md5real) NSString * docMd5;
@property (nonatomic,readonly) NSString * pathFile;
@property (nonatomic,readonly,getter=bookTitle) NSString * docTitle;
#pragma clang diagnostic pop

@end
