#import "ButtonIntegration.h"
#import <React/RCTUtils.h>
#import <RNFBCrashlytics/RNFBCrashlyticsNativeHelper.h>

@import Button;

@implementation ButtonIntegration

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(configureSDK:(NSString *)appId:(BOOL)debug) {
  @try {
    [[Button debug] setLoggingEnabled:YES];
    [[Button debug] setVisualDebuggingEnabled:debug];

    [Button configureWithApplicationId:appId completion:^(NSError *error) {
      if (error != nil) {
        NSLog(@"Error initializing Button SDK.");
      }
    }];
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

RCT_EXPORT_METHOD(setIdentifier:(NSString *)userId) {
  @try {
    [[Button user] setIdentifier:userId];
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

RCT_EXPORT_METHOD(clearAllData) {
  @try {
  [Button clearAllData];
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

RCT_EXPORT_METHOD(purchaseRequest:(NSString *)url offerID:(NSString *)offerID publisherReference:(NSString *)pubRef response:(RCTResponseSenderBlock) callback) {
  @try {
    // Step 1 - Create a Purchase Path request
    NSURL *purchaseUrl = [NSURL URLWithString:url];

    if (purchaseUrl != nil) {
      BTNPurchasePathRequest *request = [BTNPurchasePathRequest requestWithURL:purchaseUrl];

      // Step 2 - Associate the offerId
      request.offerId = offerID;

      // Optionally associate a unique token (e.g. campaign Id)
      if (pubRef != nil) {
        request.pubRef = pubRef;
      }

      // Step 3 - Fetch a Purchase Path object
      [Button.purchasePath fetchWithRequest:request purchasePathHandler:^(BTNPurchasePath *purchasePath, NSError *error) {
        // Step 4 - Start Purchase Path flow
        NSString *errorMessage = @"Undefined error";
        
        if (purchasePath == nil) {
          errorMessage = error.localizedDescription;
          callback(@[@"Retrieved purchasePath was null", errorMessage, [NSNull null]]);
        } else {
            @try {
              [purchasePath start];
            } @catch (NSException *exception) {
              NSMutableDictionary * info = [NSMutableDictionary dictionary];
              [info setValue:exception.name forKey:@"ExceptionName"];
              [info setValue:exception.reason forKey:@"ExceptionReason"];
              [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
              [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
              [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];

              NSError *error = [[NSError alloc] initWithDomain:exception.name code:-1 userInfo:info];
              [RNFBCrashlyticsNativeHelper recordNativeError:error];

              errorMessage = exception.reason;
              callback(@[@"Error when starting purchasePath", errorMessage, purchasePath]);
            }
        }

      }];
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

    callback(@[@"Error when starting purchasePath", exception.name, [NSNull null]]);
  }
}

- (NSString*)createRequestJSON: (BTNPurchasePathRequest*)request {
  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:request.URL.absoluteString, @"URL", request.pubRef ? request.pubRef : @"", @"pubRef", request.placementId ? request.placementId : @"", @"placementId", request.offerId ? request.offerId : @"", @"offerId", nil];
  NSError *writeError = nil;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *requestJSON = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return requestJSON;
}

- (NSString*)createPurchaseJSON: (BTNPurchasePath*)purchasePath {
  NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:purchasePath.attributionToken ? purchasePath.attributionToken : @"", @"attributionToken", nil];
  NSError *writeError = nil;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *purchasePathJSON = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return purchasePathJSON;
}

@end
  
