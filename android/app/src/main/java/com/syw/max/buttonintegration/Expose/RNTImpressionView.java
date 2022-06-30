package com.syw.max.buttonintegration.Expose;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.syw.max.buttonintegration.Model.OfferDetail;
import com.usebutton.sdk.impression.ImpressionView;
import com.usebutton.sdk.impression.OfferDetails;

public class RNTImpressionView extends RelativeLayout {
    private final ImpressionView impressionView;

    // Initialization.
    public RNTImpressionView(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.impressionView = new ImpressionView(getContext());
        addView(impressionView, new LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setOnClickListener(v -> {
            if (getChildCount() > 0) {
                getChildAt(0).performClick();
            }
        });
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        return true;
    }

    // Button configuration function.
    public void configureWithDetails(OfferDetail detail) {
        OfferDetails details = new OfferDetails.Builder(detail.getOfferDetailURL(), detail.getOfferDetailID(), (float) detail.getOfferDetailRate(), detail.getOfferDetailType()).build();

        this.impressionView.setCreativeType(detail.getOfferCreativeType());
        this.impressionView.configureWith(details);
    }
}
