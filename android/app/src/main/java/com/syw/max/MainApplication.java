package com.syw.max;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.sailthru.mobile.sdk.NotificationConfig;
import com.sailthru.mobile.sdk.SailthruMobile;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import com.syw.max.newarchitecture.MainApplicationReactNativeHost;
import com.syw.max.buttonintegration.ButtonIntegrationPackage;
import com.syw.max.buttonintegration.Expose.RNTImpressionViewPackage;
import com.syw.max.prodchecker.ProdCheckerPackage;
import com.syw.max.rzero.RZeroPackage;
import com.syw.max.sailthru.SailthruNotificationTappedListener;
import com.syw.max.sailthru.SailthruPackage;

import java.util.List;

import co.rzero.rzero;

import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    packages.add(new ButtonIntegrationPackage());
                    packages.add(new RNTImpressionViewPackage());
                    packages.add(new ProdCheckerPackage());
                    packages.add(new RZeroPackage());
                    packages.add(new SailthruPackage());
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected JSIModulePackage getJSIModulePackage() {
                    return new ReanimatedJSIModulePackage();
                }
            };

    private final ReactNativeHost mNewArchitectureNativeHost =
        new MainApplicationReactNativeHost(this);


    @Override
    public ReactNativeHost getReactNativeHost() {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            return mNewArchitectureNativeHost;
        } else {
            return mReactNativeHost;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        NotificationConfig config = new NotificationConfig();
        if (Build.VERSION.SDK_INT == Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("notifications", "Sailthru Mobile Notifications", NotificationManager.IMPORTANCE_HIGH);
            config.setDefaultNotificationChannel(channel);
            config.setSmallIcon(R.mipmap.ic_launcher);
        }

        SailthruMobile sailthruMobile = new SailthruMobile();
        sailthruMobile.setNotificationConfig(config);
        sailthruMobile.startEngine(getApplicationContext(), BuildConfig.SAILTHRU_APK_KEY);
        sailthruMobile.addNotificationTappedListener(new SailthruNotificationTappedListener());

        // If you opted-in for the New Architecture, we enable the TurboModule system
        ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        SoLoader.init(this, /* native exopackage */ false);

        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

        try {
           new rzero.Builder(getApplicationContext())
                  .isStaging(true)
                  .clientId(BuildConfig.RZERO_CLIENT_ID)
                  .clientToken(BuildConfig.RZERO_CLIENT_TOKEN)
                  .activityLifecycleListenerOn(false)
                  .build();
        } catch (Exception e) {
            ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
            e.printStackTrace();
        }
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.syw.max.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (Exception e) {
                ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }
}
