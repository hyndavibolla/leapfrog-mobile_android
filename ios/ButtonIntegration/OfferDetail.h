#import <Foundation/Foundation.h>

@import Button;

NS_ASSUME_NONNULL_BEGIN

@interface OfferDetail : NSObject

@property (readonly, nonatomic, copy) NSString *offerDetailURL;
@property (readonly, nonatomic, copy) NSString *offerDetailID;
@property (readonly, nonatomic, assign) double offerDetailRate;
@property (readonly, nonatomic, assign) BTNVisibleRateType offerDetailType;
@property (readonly, nonatomic, assign) BTNCreativeType offerCreativeType;

- (instancetype)initWithURL:(NSString *)url
                    offerID:(NSString *)offerID
                       rate:(NSUInteger)rate
                rateIsFixed:(BOOL)isFixed
          offerCreativeType:(NSString *)type;

@end

NS_ASSUME_NONNULL_END