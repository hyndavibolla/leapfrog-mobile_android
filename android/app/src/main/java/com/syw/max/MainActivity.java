package com.syw.max;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.syw.max.sailthru.SailthruModule;

import android.app.Activity;
import android.content.Intent;
import android.webkit.WebView;
import android.os.Bundle;
import static com.syw.max.BuildConfig.*;
import androidx.core.content.ContextCompat;

public class MainActivity extends ReactActivity {
  private static Activity currentActivity = null;

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Leapfrog";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.splashBackground));
    getWindow().getDecorView().setBackgroundColor(ContextCompat.getColor(this, R.color.splashBackground));
    super.onCreate(null);
    currentActivity = this;

    if (!FLAVOR.equals("prod")) {
      WebView.setWebContentsDebuggingEnabled(true);
    }
  }

  public static Activity getActivity(){
    Activity activity = currentActivity;
    return activity;
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
