#import "RNTImpressionView.h"
#import "OfferDetail.h"

@import Button;

@interface RNTImpressionView ()

@property (nonatomic, strong) BTNImpressionView *impressionView;

@end

@implementation RNTImpressionView

- (instancetype)init {
  self = [super init];
  if (self) {
    self.impressionView = [[BTNImpressionView alloc] init];
    [self addSubview:self.impressionView];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  
  // Set ImpressionView frame to cover the entire parent view
  self.impressionView.translatesAutoresizingMaskIntoConstraints = YES;
  self.impressionView.frame = self.bounds;
}

#pragma mark - Configuaration functions.
- (void)configureWith:(OfferDetail *)offerDetail {  
  BTNOfferDetails *details = [BTNOfferDetails detailsWithURL:offerDetail.offerDetailURL
                                                     offerId:offerDetail.offerDetailID
                                                 visibleRate:offerDetail.offerDetailRate
                                                    rateType:offerDetail.offerDetailType];
  self.impressionView.creativeType = offerDetail.offerCreativeType;
  [self.impressionView configureWithDetails:details];
}

@end
