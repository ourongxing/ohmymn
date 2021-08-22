#import "MbTopic.h"

@import Foundation;
@import JavaScriptCore;

@protocol JSBMbTopic <JSExport>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@property (nonatomic,readwrite,setter=setTopicTitle:) NSString * title;
@property (nonatomic,readonly,getter=topicid) NSString * topicId;
@property (nonatomic,readonly,getter=lastvisit) NSDate * lastVisit;
@property (nonatomic,readonly,getter=localbookmd5) NSString * mainDocMd5;
@property (nonatomic,readonly,getter=historydate) NSDate * historyDate;
@property (nonatomic,readonly,getter=syncmode) NSNumber * syncMode;
@property (nonatomic,readonly,getter=taglist) NSString * categoryList;
@property (nonatomic,readonly) NSString * hashtags;
@property (nonatomic,readonly,getter=booklist) NSString * docList;
@property (nonatomic,readonly) NSDictionary * options;
@property (nonatomic,readonly,getter=books) NSArray * documents;
@property (nonatomic,readonly) NSArray * notes;
@property (nonatomic,readwrite) BOOL hideLinksInMindMapNode;
#pragma clang diagnostic pop

@end
