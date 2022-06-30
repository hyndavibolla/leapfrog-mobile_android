#import "ProdChecker.h"
#import <RNFBCrashlytics/RNFBCrashlyticsNativeHelper.h>

@implementation ProdChecker

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getRunningEnvironment, resolver: (RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  
  BOOL isAdHoc = NO;
  BOOL isDebug;
  
#ifdef DEBUG
  isDebug = YES;
#else
  isDebug = NO;
#endif
  
  @try {
    // TestFlight Verification
    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
    NSString *receiptURLString = [receiptURL path];
    BOOL isRunningTestFlightBeta =  ([receiptURLString rangeOfString:@"sandboxReceipt"].location != NSNotFound);
    
    // AdHoc Verification
    NSData *data=[NSData dataWithContentsOfURL:[[NSBundle mainBundle]URLForResource:@"embedded" withExtension:@"mobileprovision"]];
    NSString *str=[[NSString alloc]initWithData:data encoding:NSISOLatin1StringEncoding];
    NSRange rangeOfDevicesUDIDs = [str rangeOfString:@"ProvisionedDevices"];
    isAdHoc = rangeOfDevicesUDIDs.location!=NSNotFound && !isDebug;
    
    if(isRunningTestFlightBeta || isAdHoc || isDebug) {
      NSString *thingToReturn = @"test";
      resolve(thingToReturn);
    } else {
      NSString *thingToReturn = @"live";
      resolve(thingToReturn);
    }
  } @catch (NSException *exception) {
    NSMutableDictionary * info = [NSMutableDictionary dictionary];
    [info setValue:exception.name forKey:@"ExceptionName"];
    [info setValue:exception.reason forKey:@"ExceptionReason"];
    [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
    [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
    [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];
    
    NSError *error = [[NSError alloc] initWithDomain:exception.name code:-1 userInfo:info];
    [RNFBCrashlyticsNativeHelper recordNativeError:error];
  }
}


@end
