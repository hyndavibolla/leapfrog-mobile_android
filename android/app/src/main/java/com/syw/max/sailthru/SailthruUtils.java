package com.syw.max.sailthru;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.sailthru.mobile.sdk.MessageStream;
import com.sailthru.mobile.sdk.SailthruMobile;

public class SailthruUtils {
    private static void promiseSuccessful(Promise promise) {
        promise.resolve("success");
    }

    private static void promiseFailure(Promise promise, Error error) {
        promise.reject(error);
    }

    public static SailthruMobile.AttributesHandler generateSailThroughCallback(Promise promise) {
        return new SailthruMobile.AttributesHandler() {
            @Override
            public void onSuccess() {
                promiseSuccessful(promise);
            }

            @Override
            public void onFailure(Error error) {
                promiseFailure(promise, error);
            }
        };
    }

    public static SailthruMobile.SailthruMobileHandler generateSailthruMobileHandler(Promise promise) {
        return new SailthruMobile.SailthruMobileHandler<Void>() {
            @Override
            public void onSuccess(Void value) {
                promiseSuccessful(promise);
            }

            @Override
            public void onFailure(Error error) {
                promiseFailure(promise, error);
            }
        };
    }

    public static MessageStream.MessagesReadHandler generateMessageReadHandler(Promise promise) {
        return new MessageStream.MessagesReadHandler() {
            @Override
            public void onSuccess() {
                promiseSuccessful(promise);
            }

            @Override
            public void onFailure(@NonNull Error error) {
                promiseFailure(promise, error);
            }
        };
    }
}
