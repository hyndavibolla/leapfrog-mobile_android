package com.syw.max.prodchecker;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

public class ProdChecker extends ReactContextBaseJavaModule {
    private static ReactApplicationContext ReactContext;

    ProdChecker(ReactApplicationContext context) {
        super(context);

        ReactContext = context;
    }

    @Override
    public String getName() { return "ProdChecker"; }

    @ReactMethod
    public void getRunningEnvironment(Promise promise) {
      try {
        // A list with valid installers package name
        List<String> validInstallers = new ArrayList<>(Arrays.asList("com.android.vending", "com.google.android.feedback"));

        // The package name of the app that has installed your app
        final String installer = ReactContext.getPackageManager().getInstallerPackageName(ReactContext.getPackageName());

        // true if your app has been downloaded from Play Store
        boolean isOnPlayStore = installer != null && validInstallers.contains(installer);

        if (isOnPlayStore) {
            promise.resolve("live");
        } else {
            promise.resolve("test");
        }
      } catch (Exception e) {
        ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        e.printStackTrace();
        promise.resolve("live");
      }
    }
}