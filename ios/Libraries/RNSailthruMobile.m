#import "RNSailthruMobile.h"
#import <UserNotifications/UserNotifications.h>
#import <RNFBCrashlytics/RNFBCrashlyticsNativeHelper.h>
#import <React/RCTBundleURLProvider.h>

@interface STMMessage ()

- (nullable instancetype)initWithDictionary:(nonnull NSDictionary *)dictionary;
- (nonnull NSDictionary *)dictionary;

@end

@interface STMContentItem ()

- (nullable instancetype)initWithDictionary:(nonnull NSDictionary *)dictionary;
- (nonnull NSDictionary *)dictionary;

@end

@interface STMPurchase ()

- (nullable instancetype)initWithDictionary:(NSDictionary *)dictionary;

@end

@implementation RNSailthruMobile

RCT_EXPORT_MODULE(SailthruModule);

+ (SailthruMobile *)sailthruMobile {
    static SailthruMobile *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [SailthruMobile new];
    });
    return sharedInstance;
}

+ (STMMessageStream *)messageStream {
    static STMMessageStream *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [STMMessageStream new];
    });
    return sharedInstance;
}

-(instancetype)init {
  self = [super init];
  if(self) {
    _displayInAppNotifications = YES;
    [[RNSailthruMobile sailthruMobile] setGeoIPTrackingDefault:YES];
    [[RNSailthruMobile messageStream] setDelegate:self];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"inappnotification", @"NotificationTapped"];
}

- (BOOL)shouldPresentInAppNotificationForMessage:(STMMessage *)message {
  @try {
    NSMutableDictionary *payload = [NSMutableDictionary dictionaryWithDictionary:[message dictionary]];

    NSMutableDictionary *attributes = [NSMutableDictionary dictionaryWithDictionary:[message attributes]];
  
    static const NSString* kKeyToCheck = @"NEW_ON_MAX";
  
    if ([message attributes]) {
        [payload setObject:[message attributes] forKey:@"attributes"];
    }
  
    if (attributes[@"categories"] == kKeyToCheck) {
      [[STMMessageStream new] registerImpressionWithType:STMImpressionTypeInAppNotificationView forMessage:message];
    }

    return NO;
  } @catch (NSException *exception) {
    NSMutableDictionary * info = [NSMutableDictionary dictionary];
    [info setValue:exception.name forKey:@"ExceptionName"];
    [info setValue:exception.reason forKey:@"ExceptionReason"];
    [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
    [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
    [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];

    NSError *error = [[NSError alloc] initWithDomain:exception.name code:-1 userInfo:info];
    [RNFBCrashlyticsNativeHelper recordNativeError:error];

    return NO;
  }
}

#pragma mark - Messages
// Note: We use promises for our return values, not callbacks.

RCT_REMAP_METHOD(getMessages, resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [[RNSailthruMobile messageStream] messages:^(NSArray * _Nullable messages, NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve([RNSailthruMobile arrayOfMessageDictionariesFromMessageArray:messages]);
        }
    }];
}

#pragma mark - Attributes
RCT_EXPORT_METHOD(setAttributes:(NSDictionary *)attributeMap resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)  {
  @try {
    STMAttributes *stmAttributes = [[STMAttributes alloc] init];
    [stmAttributes setAttributesMergeRule:(STMAttributesMergeRule)[attributeMap valueForKey:@"mergeRule"]];

    NSDictionary *attributes = [attributeMap valueForKey:@"attributes"];

    for (NSString *key in attributes) {
        NSString *type = [[attributes valueForKey:key] valueForKey:@"type"];

        if ([type isEqualToString:@"string"]) {
            NSString *value = [[attributes valueForKey:key] valueForKey:@"value"];
            [stmAttributes setString:value forKey:key];

        } else if ([type isEqualToString:@"stringArray"]) {
            NSArray<NSString *> *value = [[attributes valueForKey:key] valueForKey:@"value"];
            [stmAttributes setStrings:value forKey:key];

        } else if ([type isEqualToString:@"integer"]) {
            NSNumber *value = [[attributes valueForKey:key] objectForKey:@"value"];
            [stmAttributes setInteger:[value integerValue] forKey:key];

        } else if ([type isEqualToString:@"integerArray"]) {
            NSArray<NSNumber *> *value = [[attributes valueForKey:key] valueForKey:@"value"];
            [stmAttributes setIntegers:value forKey:key];

        } else if ([type isEqualToString:@"boolean"]) {
            BOOL value = [[[attributes valueForKey:key] valueForKey:@"value"] boolValue];
            [stmAttributes setBool:value forKey:key];

        } else if ([type isEqualToString:@"float"]) {
            NSNumber *numberValue = [[attributes valueForKey:key] objectForKey:@"value"];
            [stmAttributes setFloat:[numberValue floatValue] forKey:key];

        } else if ([type isEqualToString:@"floatArray"]) {
            NSArray<NSNumber *> *value = [[attributes valueForKey:key] objectForKey:@"value"];
            [stmAttributes setFloats:value forKey:key];

        } else if ([type isEqualToString:@"date"]) {
            NSNumber *millisecondsValue = [[attributes valueForKey:key] objectForKey:@"value"];
            NSNumber *value = @([millisecondsValue doubleValue] / 1000);

            if (![value isKindOfClass:[NSNumber class]]) {
                return;
            }

            NSDate *date = [NSDate dateWithTimeIntervalSince1970:[value doubleValue]];
            if (date) {
                [stmAttributes setDate:date forKey:key];
            } else {
                return;
            }

        } else if ([type isEqualToString:@"dateArray"]) {
            NSArray<NSNumber *> *value = [[attributes valueForKey:key] objectForKey:@"value"];
            NSMutableArray<NSDate *> *dates = [[NSMutableArray alloc] init];
            for (NSNumber *millisecondsValue in value) {
                NSNumber *secondsValue = @([millisecondsValue doubleValue] / 1000);

                if (![secondsValue isKindOfClass:[NSNumber class]]) {
                    continue;
                }

                NSDate *date = [NSDate dateWithTimeIntervalSince1970:[secondsValue doubleValue]];
                if (date) {
                    [dates addObject:date];
                }
            }

            [stmAttributes setDates:dates forKey:key];
        }
    }

    [[RNSailthruMobile sailthruMobile] setAttributes:stmAttributes withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}


#pragma mark - Location

RCT_EXPORT_METHOD(updateLocation:(CGFloat)lat lon:(CGFloat)lon) {
  @try {
    [[RNSailthruMobile sailthruMobile] updateLocation:[[CLLocation alloc] initWithLatitude:lat longitude:lon]];
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

#pragma mark - Events

RCT_EXPORT_METHOD(logEvent:(NSString *)name) {
  @try {
    [[RNSailthruMobile sailthruMobile] logEvent:name];
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

RCT_EXPORT_METHOD(logEvent:(NSString *)name withVars:(NSDictionary*)varsDict) {
  @try {
    [[RNSailthruMobile sailthruMobile] logEvent:name withVars:varsDict];
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


#pragma mark - Message Stream

RCT_EXPORT_METHOD(getUnreadCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile messageStream] unreadCount:^(NSUInteger unreadCount, NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(@(unreadCount));
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}


RCT_EXPORT_METHOD(markMessageAsRead:(NSDictionary*)jsDict resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile messageStream] markMessageAsRead:[RNSailthruMobile messageFromDict:jsDict] withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(removeMessage:(NSDictionary *)jsDict resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile messageStream] removeMessage:[RNSailthruMobile messageFromDict:jsDict] withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(presentMessageDetail:(NSDictionary *)jsDict) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RNSailthruMobile messageStream] presentMessageDetailForMessage:[RNSailthruMobile messageFromDict:jsDict]];
    });
}

RCT_EXPORT_METHOD(dismissMessageDetail) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[RNSailthruMobile messageStream] dismissMessageDetail];
    });
}

RCT_EXPORT_METHOD(registerMessageImpression:(NSInteger)impressionType forMessage:(NSDictionary *)jsDict) {
  @try {
    [[RNSailthruMobile messageStream] registerImpressionWithType:impressionType forMessage:[RNSailthruMobile messageFromDict:jsDict]];
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



#pragma mark - IDs

RCT_EXPORT_METHOD(getDeviceID:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] deviceID:^(NSString * _Nullable deviceID, NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(deviceID);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(getInitialNotification: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject) {
  NSLog(@"Z-Flag: Native: getInitialNotification");
    resolve(NULL);
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userID resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] setUserId:userID withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(userID);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(setExtId:(NSString *)extId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    STMAttributes *attributes = [[STMAttributes alloc] init];
    [attributes setString:extId forKey:@"extId"];
    [[RNSailthruMobile sailthruMobile] setAttributes:attributes withResponse:^(NSError * _Nullable error) {
      if (error) {
        NSLog(@"Error - %@", [error debugDescription]);
        [RNSailthruMobile rejectPromise:reject withError:error];
      } else {
        resolve(extId);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(setUserEmail:(NSString *)userEmail resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
      [[RNSailthruMobile sailthruMobile] setUserEmail:userEmail withResponse:^(NSError * _Nullable error) {
          if (error) {
              [RNSailthruMobile rejectPromise:reject withError:error];
          } else {
              resolve(userEmail);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}


#pragma mark - Recommendations

RCT_EXPORT_METHOD(getRecommendations:(NSString *)sectionID resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
  [[RNSailthruMobile sailthruMobile] recommendationsWithSection:sectionID withResponse:^(NSArray * _Nullable contentItems, NSError * _Nullable error) {
    if(error) {
      [RNSailthruMobile rejectPromise:reject withError:error];
    } else {
      resolve([RNSailthruMobile arrayOfContentItemsDictionaryFromContentItemsArray:contentItems]);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(trackClick:(NSString *)sectionID url:(NSString *)url resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    NSURL *nsUrl = [[NSURL alloc] initWithString:url];
    [[RNSailthruMobile sailthruMobile] trackClickWithSection:sectionID andUrl:nsUrl andResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(trackPageview:(NSString *)url tags:(NSArray *)tags resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    NSURL *nsUrl = [[NSURL alloc] initWithString:url];
    void (^responseBlock)(NSError * _Nullable) = ^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
        }
    };

    if(tags) {
        [[RNSailthruMobile sailthruMobile] trackPageviewWithUrl:nsUrl andTags:tags andResponse:responseBlock];
    }
    else {
        [[RNSailthruMobile sailthruMobile] trackPageviewWithUrl:nsUrl andResponse:responseBlock];
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(trackImpression:(NSString *)sectionID url:(NSArray *)urls resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    void (^responseBlock)(NSError * _Nullable) = ^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
        }
    };

    if(urls) {
        NSMutableArray *nsUrls = [[NSMutableArray alloc] init];
        for (NSString *url in urls) {
            NSURL *nsUrl = [[NSURL alloc] initWithString:url];
            [nsUrls addObject:nsUrl];
        }
        [[RNSailthruMobile sailthruMobile] trackImpressionWithSection:sectionID andUrls:nsUrls andResponse:responseBlock];
    }
    else {
        [[RNSailthruMobile sailthruMobile] trackImpressionWithSection:sectionID andResponse:responseBlock];
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}



#pragma mark - Switches
RCT_EXPORT_METHOD(setGeoIPTrackingEnabled:(BOOL)enabled) {
  @try {
    [[RNSailthruMobile sailthruMobile] setGeoIPTrackingEnabled:enabled];
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

RCT_EXPORT_METHOD(setGeoIPTrackingEnabled:(BOOL)enabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] setGeoIPTrackingEnabled:enabled withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

RCT_EXPORT_METHOD(setCrashHandlersEnabled:(BOOL)enabled) {
  @try {
    [[RNSailthruMobile sailthruMobile] setCrashHandlersEnabled:enabled];
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

// Push Registration
RCT_EXPORT_METHOD(registerForPushNotifications) {
  @try {
    UNAuthorizationOptions options = UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound;
    if ([[NSProcessInfo processInfo] operatingSystemVersion].majorVersion >= 10) {
        [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:options completionHandler:^(BOOL granted, NSError * _Nullable error) {}];
    }
    else {
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationType)options categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    }

    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
        if(![[UIApplication sharedApplication] isRegisteredForRemoteNotifications]) {
            [[UIApplication sharedApplication] registerForRemoteNotifications];
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

RCT_EXPORT_METHOD(clearDevice:(NSInteger)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] clearDeviceData:(STMDeviceDataType)options withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

#pragma mark - Profile Vars

RCT_EXPORT_METHOD(setProfileVars:(NSDictionary *)vars resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] setProfileVars:vars withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(getProfileVars:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    [[RNSailthruMobile sailthruMobile] getProfileVarsWithResponse:^(NSDictionary<NSString *,id> * _Nullable vars, NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(vars);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}


#pragma mark - Purchases

RCT_EXPORT_METHOD(logPurchase:(NSDictionary *)purchaseDict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    STMPurchase *purchase = [[STMPurchase alloc] initWithDictionary:purchaseDict];
    @try {
    [[RNSailthruMobile sailthruMobile] logPurchase:purchase withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

RCT_EXPORT_METHOD(logAbandonedCart:(NSDictionary *)purchaseDict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    STMPurchase *purchase = [[STMPurchase alloc] initWithDictionary:purchaseDict];
    [[RNSailthruMobile sailthruMobile]logAbandonedCart:purchase withResponse:^(NSError * _Nullable error) {
        if (error) {
            [RNSailthruMobile rejectPromise:reject withError:error];
        } else {
            resolve(nil);
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

    [RNSailthruMobile rejectPromise:reject withError:error];
  }
}

#pragma mark - Helper Fuctions

+ (void)rejectPromise:(RCTPromiseRejectBlock)reject withError:(NSError *)error {
    reject([NSString stringWithFormat:@"%ld", error.code], error.localizedDescription, error);
}


+ (NSArray *)arrayOfMessageDictionariesFromMessageArray:(NSArray *)messageArray {
    NSMutableArray *messageDictionaries = [NSMutableArray array];
    for (STMMessage *message in messageArray) {
        [messageDictionaries addObject:[message dictionary]];
    }
    return messageDictionaries;
}

+ (STMMessage *) messageFromDict:(NSDictionary *)jsDict {
    return [[STMMessage alloc] initWithDictionary:jsDict];
}

+ (NSArray *)arrayOfContentItemsDictionaryFromContentItemsArray:(NSArray *)contentItemsArray {
  NSMutableArray *items = [NSMutableArray array];
  for (STMContentItem *contentItem in contentItemsArray) {
    [items addObject:[contentItem dictionary]];
  }
  return items;
}

@end
