package com.syw.max.sailthru;

import android.content.Context;
import android.os.Bundle;

import com.sailthru.mobile.sdk.interfaces.NotificationTappedListener;

public class SailthruNotificationTappedListener implements NotificationTappedListener {
  
    @Override
    public void onNotificationTapped(Context context, Bundle bundle) {
        SailthruModule.sendEvent("NotificationTapped", bundle);
    }
}
