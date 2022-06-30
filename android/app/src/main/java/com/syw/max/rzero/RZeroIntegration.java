package com.syw.max.rzero;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

import co.rzero.rzero;

import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

public class RZeroIntegration extends ReactContextBaseJavaModule {

    RZeroIntegration(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void sendEventForVisibilityChange(String path, Boolean isEntering) {
        try {
            if (isEntering) {
                rzero.getInstance().sendEventForVisibilityChange(path, true);
            } else {
                rzero.getInstance().sendEventForVisibilityChange(path, false);
            }
        } catch (Exception e) {
          ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
          e.printStackTrace();
        }
    }

    @ReactMethod
    public void logEvent(String eventName) {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("event_name", eventName);
            rzero.getInstance().logCustomEvent(map);
        } catch (Exception e) {
          ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
          e.printStackTrace();
        }
    }

    @ReactMethod
    public void flush() {
        try {
            rzero.getInstance().flush();
        } catch (Exception e) {
          ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
          e.printStackTrace();
        }
    }

    @ReactMethod
    public void setUserId(String userId) {
        try {
            rzero.getInstance().setUserId(userId);
        } catch (Exception e) {
            ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
            e.printStackTrace();
        }
    }

    @NotNull
    @Override
    public String getName() {
        return "RZeroIntegration";
    }
}
