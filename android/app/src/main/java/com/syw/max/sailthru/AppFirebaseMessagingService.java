package com.syw.max.sailthru;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.sailthru.mobile.sdk.SailthruMobile;
import com.syw.max.BuildConfig;

public class AppFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        SailthruMobile sailthruMobile = new SailthruMobile();
        sailthruMobile.handleNotification(remoteMessage);
    }

    @Override
    public void onNewToken(String token) {
        new SailthruMobile().setDeviceToken(token);
    }

}
