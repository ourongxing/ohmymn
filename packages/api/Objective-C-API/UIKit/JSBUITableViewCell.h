#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
@import JavaScriptCore;

@protocol JSBUIView;

@protocol JSBUITableViewCell <JSExport, JSBUIView>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"


@property (nonatomic, readonly, strong) UIView *contentView;
@property (nonatomic, readonly, strong) UILabel *textLabel;
@property (nonatomic, readonly, strong) UILabel *detailTextLabel;
@property (nonatomic, readonly, strong) UIImageView *imageView;
@property (nonatomic, strong) NSIndexPath * indexPath;
@property (nonatomic, weak) UITableView * tableView;
@property (nonatomic, strong) UIView *backgroundView;
@property (nonatomic, strong) UIView *selectedBackgroundView;
@property (nonatomic) UITableViewCellSelectionStyle selectionStyle;
@property (nonatomic) NSInteger indentationLevel;
@property (nonatomic) UITableViewCellAccessoryType accessoryType;
@property (nonatomic, strong) UIView *accessoryView;
@property (nonatomic) UITableViewCellAccessoryType editingAccessoryType;
@property (nonatomic, getter=isSelected) BOOL selected;
@property (nonatomic, getter=isHighlighted) BOOL highlighted;
@property (nonatomic, getter=isEditing) BOOL editing; // not yet implemented
@property (nonatomic, readonly) BOOL showingDeleteConfirmation;  // not yet implemented
@property (nonatomic, readonly, copy) NSString *reuseIdentifier;
@property (nonatomic, assign) CGFloat indentationWidth; // 10 per default
@property (nonatomic, strong) UIColor *tintColor;
@property (nonatomic, assign) BOOL showsReorderControl; // 10 per default
@property (nonatomic, readonly) UIImageView * multiSelView;

+ (id)makeWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier;
- (void)prepareForReuse;
- (void)setSelected:(BOOL)selected animated:(BOOL)animated;
- (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated;
- (void)setEditing:(BOOL)editing animated:(BOOL)animated;
//- (void)willTransitionToState:(UITableViewCellStateMask)state;
//- (void)didTransitionToState:(UITableViewCellStateMask)state;
//- (id)initWithFrame:(CGRect)frame reuseIdentifier:(NSString *)reuseIdentifier;

#pragma clang diagnostic pop

@end
