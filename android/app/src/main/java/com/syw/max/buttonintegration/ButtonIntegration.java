package com.syw.max.buttonintegration;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.usebutton.sdk.Button;
import com.usebutton.sdk.purchasepath.PurchasePathRequest;

import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

import org.json.JSONException;
import org.json.JSONObject;

import static com.syw.max.BuildConfig.BUILD_TYPE;

public class ButtonIntegration extends ReactContextBaseJavaModule {
    private static ReactApplicationContext ReactContext;

    ButtonIntegration(ReactApplicationContext context) {
        super(context);

        ReactContext = context;
    }

    @Override
    public String getName() {
        return "ButtonIntegration";
    }

    @ReactMethod
    public void configureSDK(String appId, boolean debug) {
      try {
        if (BUILD_TYPE == "debug") {
            Button.debug().setLoggingEnabled(true);
        }

        Button.debug().setVisualDebuggingEnabled(debug);
        Button.configure(ReactContext.getApplicationContext(), appId);
      } catch (Exception e) {
        ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        e.printStackTrace();
      }
    }

    @ReactMethod
    public void setIdentifier(String userId) {
      try {
        Button.user().setIdentifier(userId);
      } catch (Exception e) {
        ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        e.printStackTrace();
      }
    }

    @ReactMethod
    public void clearAllData() {
      try {
        Button.clearAllData();
      } catch (Exception e) {
        ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        e.printStackTrace();
      }
    }

    @ReactMethod
    public void purchaseRequest(String url, String offerID, String publisherReference, Callback errorCallback) {
      try {
        // Step 1 - Create a Purchase Path request
        PurchasePathRequest request = new PurchasePathRequest(url);

        // Step 2 - Associate the offerId
        request.setOfferId(offerID);

        // Optionally associate a unique token (e.g. campaign Id)
        request.setPubRef(publisherReference);

        // Step 3 - Fetch a Purchase Path object
        Button.purchasePath().fetch(request, (purchasePath, throwable) -> {
            // Step 4 - Start Purchase Path flow
            try {
              if (purchasePath == null) {
                errorCallback.invoke("Retrieved purchasePath was null", throwable.getMessage(), null);
                return;
              }

              purchasePath.start(ReactContext);
            } catch (Exception e) {
              ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
              e.printStackTrace();
              errorCallback.invoke("Error when starting purchasePath", e.getMessage(), purchasePath);
            }
        });
      } catch (Exception e) {
        ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
        e.printStackTrace();
      }
    }
}
