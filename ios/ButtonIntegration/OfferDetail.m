#import "OfferDetail.h"

@interface OfferDetail ()

@property (nonatomic, copy) NSString *offerDetailURL;
@property (nonatomic, copy) NSString *offerDetailID;
@property (nonatomic, assign) double offerDetailRate;
@property (nonatomic, assign) BTNVisibleRateType offerDetailType;
@property (nonatomic, assign) BTNCreativeType offerCreativeType;

@end

@implementation OfferDetail

#pragma mark - Creative type functions.
- (BTNCreativeType)getCreativeTypeFor:(NSString *)creativeType {
  if ([creativeType isEqualToString:@"hero"]) {
    return BTNCreativeTypeHero;
  } else if ([creativeType isEqualToString:@"carousel"]) {
    return BTNCreativeTypeCarousel;
  } else if ([creativeType isEqualToString:@"list"]) {
    return BTNCreativeTypeList;
  } else if ([creativeType isEqualToString:@"grid"]) {
    return BTNCreativeTypeGrid;
  } else if ([creativeType isEqualToString:@"detail"]) {
    return BTNCreativeTypeDetail;
  }
  
  return BTNCreativeTypeOther;
}

#pragma mark - Initialization.
- (instancetype)initWithURL:(NSString *)url
                    offerID:(NSString *)offerID
                       rate:(NSUInteger)rate
                rateIsFixed:(BOOL)isFixed
          offerCreativeType:(NSString *)type {
  self = [super init];
  
  if (self != nil) {
    _offerDetailURL = url;
    _offerDetailID = offerID;
    _offerDetailRate = rate;
    _offerDetailType = (isFixed) ? BTNVisibleRateTypeFixed : BTNVisibleRateTypePercent;
    _offerCreativeType = [self getCreativeTypeFor:type];
  }
  
  return self;
}

@end