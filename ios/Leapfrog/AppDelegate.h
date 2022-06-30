#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <RNAppsFlyer.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic) RNAppsFlyer *AppsFlyerDelegate;

@end
