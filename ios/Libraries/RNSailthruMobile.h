
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#include <SailthruMobile/SailthruMobile.h>

@interface RNSailthruMobile : RCTEventEmitter <RCTBridgeModule, STMMessageStreamDelegate>

@property BOOL displayInAppNotifications;

+ (SailthruMobile *)sailthruMobile;
/**
 * Return array of supported RN events.
 *
 * @return array containing supported events strings.
 */
- (NSArray<NSString *> *)supportedEvents;

@end
