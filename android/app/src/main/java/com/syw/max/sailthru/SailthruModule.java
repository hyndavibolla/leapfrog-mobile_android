package com.syw.max.sailthru;

import static io.invertase.firebase.app.ReactNativeFirebaseApp.getApplicationContext;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.sailthru.mobile.sdk.MessageStream;
import com.sailthru.mobile.sdk.NotificationConfig;
import com.sailthru.mobile.sdk.SailthruMobile;
import com.sailthru.mobile.sdk.enums.ImpressionType;
import com.sailthru.mobile.sdk.model.AttributeMap;
import com.sailthru.mobile.sdk.model.Message;
import com.syw.max.BuildConfig;
import com.syw.max.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;

import io.invertase.firebase.common.SharedUtils;
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

public class SailthruModule extends ReactContextBaseJavaModule {

    protected static final String FILTER_ATTRIBUTE_KEY = "NEW_ON_MAX";
    private static ReactApplicationContext reactContext;
    private HashMap<String, Boolean> initialNotificationMap = new HashMap<>();

    @RequiresApi(api = Build.VERSION_CODES.O)
    SailthruModule(ReactApplicationContext context, Activity activity) {
        super(context);
        reactContext = context;
        setupNewOnMaxFilter();
    }

    public void setupNewOnMaxFilter() {
        new MessageStream().setOnInAppNotificationDisplayListener(
                new MessageStream.OnInAppNotificationDisplayListener() {
                    @Override
                    public boolean shouldPresentInAppNotification(Message message) {
                        try {
                            HashMap<String, String> attributesMap = message.getAttributes();
                            if (attributesMap.get("category").equals(FILTER_ATTRIBUTE_KEY)) {
                                new MessageStream().registerMessageImpression(ImpressionType.IMPRESSION_TYPE_IN_APP_VIEW, message);
                                return false;
                            }
                        } catch (Exception e) {
                            ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
                            e.printStackTrace();
                        }
                        return true;
                    }
                });
    }

    @ReactMethod
    public void setUserId(String userId, Promise promise) {
        if (userId.equals("")) {
            userId = null;
        }
        new SailthruMobile().setUserId(userId, SailthruUtils.generateSailthruMobileHandler(promise));
    }

    @ReactMethod
    public void setUserEmail(String userEmail, Promise promise) {
        if (userEmail.equals("")) {
            userEmail = null;
        }
        new SailthruMobile().setUserEmail(userEmail, SailthruUtils.generateSailthruMobileHandler(promise));
    }

    @ReactMethod
    public void setExtId(String extId, Promise promise) {
        AttributeMap attributes = new AttributeMap();
        attributes.putString("extId", extId);
        SailthruMobile sailthruMobile = new SailthruMobile();
        sailthruMobile.setAttributes(attributes, SailthruUtils.generateSailThroughCallback(promise));
    }

    @ReactMethod
    public void getMessages(Promise promise) {
        new MessageStream().getMessages(new MessageStream.MessagesHandler() {
            @Override
            public void onSuccess(@NonNull ArrayList<Message> messages) {
                WritableArray array = getWritableArray();
                try {
                    for (Message message : messages) {
                        JSONObject messageJson = message.toJSON();
                        if (messageJson == null)
                            continue;
                        array.pushMap(SharedUtils.jsonObjectToWritableMap(messageJson));
                    }
                    promise.resolve(array);
                } catch (Exception error) {
                    promise.reject(error);
                }
            }

            @Override
            public void onFailure(@NonNull Error error) {
                promise.reject(error);
            }
        });
    }

    @ReactMethod
    public void markMessageAsRead(ReadableMap messageMap, final Promise promise) {
        Message message;
        try {
            message = getMessage(messageMap);
        } catch (Exception error) {
            promise.reject(error);
            return;
        }

        new MessageStream().setMessageRead(message, SailthruUtils.generateMessageReadHandler(promise));
    }

    protected @NonNull
    Message getMessage(ReadableMap messageMap) throws JSONException, NoSuchMethodException, IllegalAccessException,
            InvocationTargetException, InstantiationException {
        Constructor<Message> constructor = Message.class.getDeclaredConstructor(String.class);
        constructor.setAccessible(true);
        return constructor.newInstance(SharedUtils.readableMapToWritableMap(messageMap).toString());
    }

    private WritableArray getWritableArray() {
        return new WritableNativeArray();
    }

    public static void sendEvent(String eventName, Bundle bundle) {
        WritableMap params = Arguments.fromBundle(bundle);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
    }

    @ReactMethod
    public void removeListeners(Integer count) {
    }

    @ReactMethod
    public void getInitialNotification(Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.resolve(null);
                return;
            }

            Intent intent = activity.getIntent();
            if (intent == null || intent.getExtras() == null) {
                promise.resolve(null);
                return;
            }

            String notificationId = intent.getExtras().getString("_nid");
            if (notificationId == null || initialNotificationMap.get(notificationId) != null) {
                promise.resolve(null);
                return;
            }

            WritableMap remoteMessageMap = Arguments.fromBundle(intent.getExtras());
            if (remoteMessageMap == null) {
                promise.resolve(null);
                return;
            }

            promise.resolve(remoteMessageMap);
            initialNotificationMap.put(notificationId, true);
        } catch (Exception error) {
            promise.resolve(null);
            ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(error);
            error.printStackTrace();
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "SailthruModule";
    }
}