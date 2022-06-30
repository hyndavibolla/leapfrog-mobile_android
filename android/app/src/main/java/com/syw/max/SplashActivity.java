package com.syw.max;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import org.devio.rn.splashscreen.SplashScreen;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.splashBackground));
        getWindow().getDecorView().setBackgroundColor(ContextCompat.getColor(this, R.color.splashBackground));
//        SplashScreen.show(this);  commented to enable native customization
        super.onCreate(savedInstanceState);
        Intent intent = new Intent(this, MainActivity.class);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            intent.putExtras(extras);
        }
        startActivity(intent);
        finish();
    }
}
