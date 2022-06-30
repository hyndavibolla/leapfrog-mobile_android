package com.syw.max.sailthru;

import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.syw.max.MainActivity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;

public class SailthruPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        try {
            modules.add(new SailthruModule(reactContext,  MainActivity.getActivity()));
        } catch (NoClassDefFoundError e) {
            ReactNativeFirebaseCrashlyticsNativeHelper.recordNativeException(e);
            e.printStackTrace();
        }
        return modules;
    }
}
