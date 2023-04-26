#import <Foundation/NSObject.h>

@import Foundation;
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBNSObject;

@protocol JSBNSIndexPath <JSExport, JSBNSObject>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

+ (instancetype)indexPathWithIndex:(NSUInteger)index;
+ (instancetype)indexPathWithIndexes:(const NSUInteger [])indexes length:(NSUInteger)length;

- (NSIndexPath *)indexPathByAddingIndex:(NSUInteger)index;
- (NSIndexPath *)indexPathByRemovingLastIndex;
- (NSUInteger)indexAtPosition:(NSUInteger)position;
- (NSUInteger)length;
- (void)getIndexes:(NSUInteger *)indexes;
- (NSComparisonResult)compare:(NSIndexPath *)otherObject;

#pragma mark - UIKit

@property (readonly) NSUInteger row;
@property (readonly) NSUInteger section;

+ (NSIndexPath *)indexPathForRow:(NSInteger)row inSection:(NSInteger)section;
+ (NSIndexPath *)indexPathForItem:(NSInteger)item inSection:(NSInteger)section;

#pragma clang diagnostic pop

@end
