//
//  AppleWalletBridge.m
//  ShopYourWayMAX
//
//  Created by Sergio Daniel on 14/11/21.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AppleWallet, NSObject)

RCT_EXTERN_METHOD(addPassWithId:(NSString *)passId withBase64Data:(NSString *)base64Pass resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(canAddPasses:(RCTResponseSenderBlock *)callback)

@end
