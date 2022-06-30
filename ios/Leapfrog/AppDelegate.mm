#import "AppDelegate.h"

#import <GoogleMaps/GoogleMaps.h>
#import <Firebase.h>
#import "RNSailthruMobile.h"
#import <React/RCTLinkingManager.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

// AppsFlyer imports
#import <RNAppsFlyer.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@class RZeroIntegration;

@interface RZeroIntegration
+ (void)initializeWithClientToken: (NSString *)token andClientId: (NSString *)clientId;
@end

@implementation AppDelegate
RNSailthruMobile *moduleRNSailthruMobile;
RCTBridge * bridge;

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary<UIApplicationLaunchOptionsKey,id> *)launchOption
{
  // BEGIN AppsFlyer workaround -- See https://github.com/AppsFlyerSDK/appsflyer-react-native-plugin/issues/223#issuecomment-768371228
  if(_AppsFlyerDelegate == nil) {
    _AppsFlyerDelegate = [[RNAppsFlyer alloc] init];
  }
  [[AppsFlyerLib shared] setDeepLinkDelegate:_AppsFlyerDelegate]; // https://github.com/AppsFlyerSDK/appsflyer-react-native-plugin/issues/223#issuecomment-770335013
  [AppsFlyerLib shared].appsFlyerDevKey = @"ppqxCDrMExtpEEZJjt6ryS"; // HACK: iOS SDK is faster than RN plugin
  // END AppsFlyer workaround
  UNUserNotificationCenter.currentNotificationCenter.delegate = self;
  [UIApplication.sharedApplication registerForRemoteNotifications];

  return YES;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyDVHuWhsvvuV_PbC0IslvfOV-2Pzljde8o"]; // API key obtained from Google Console
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif

  [RZeroIntegration initializeWithClientToken:@"AFziXqMKOjHZlQYePKpu" andClientId:@"shopyourway"];

  NSBundle* mainBundle = [NSBundle mainBundle];
  NSString *appKey = [mainBundle objectForInfoDictionaryKey:@"SAILTRHU_APP_KEY"];
  [[RNSailthruMobile sailthruMobile] startEngine:appKey withAuthorizationOption:STMPushAuthorizationOptionNoRequest];

  bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  moduleRNSailthruMobile = [bridge moduleForClass:RNSailthruMobile.class];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Leapfrog"
                                            initialProperties:nil];

  rootView.backgroundColor = [UIColor whiteColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Reports app open frm URL Scheme deep link for iOS 10
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  [[AppsFlyerAttribution shared] handleOpenUrl:url options:options];
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)application:(UIApplication *) application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken {
  [[AppsFlyerLib shared] registerUninstall: deviceToken];
  [[RNSailthruMobile sailthruMobile] setDeviceTokenInBackground:deviceToken];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler {
    [[AppsFlyerAttribution shared] continueUserActivity:userActivity restorationHandler:restorationHandler];
    return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"1. userNotificationCenter didReceiveNotificationResponse");
  [[RNSailthruMobile sailthruMobile] handleNotificationResponse:response];
  NSString *eventType = response.notification.request.content.userInfo[@"eventType"];
  if (eventType != nil) {
    if (bridge.loading) {
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 5 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [moduleRNSailthruMobile sendEventWithName:@"NotificationTapped" body:@{@"eventType":eventType}];
      });
    } else {
      [moduleRNSailthruMobile sendEventWithName:@"NotificationTapped" body:@{@"eventType":eventType}];
    }
  }
  completionHandler();
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSLog(@"0. userNotificationCenter willPresentNotification");
  [[RNSailthruMobile sailthruMobile] handlePresentNotification:notification];
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}
@end
