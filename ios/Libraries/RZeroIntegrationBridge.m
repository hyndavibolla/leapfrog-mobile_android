#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RZeroIntegration, NSObject)

  RCT_EXTERN_METHOD(sendEventForVisibilityChange:(NSString *)path isEntering:(BOOL)appear)
  RCT_EXTERN_METHOD(logEvent:(NSString *)eventName)
  RCT_EXTERN_METHOD(flush)
  RCT_EXTERN_METHOD(setUserId:(NSString *)userId)

@end
