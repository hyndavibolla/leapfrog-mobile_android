package com.syw.max.buttonintegration.Expose;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.syw.max.buttonintegration.Model.OfferDetail;

import java.util.Map;

public class RNTImpressionViewManager extends ViewGroupManager<RNTImpressionView> {
    public static final String REACT_CLASS = "RNTImpressionView";
    ReactApplicationContext callerContext;

    // Initialization.
    public RNTImpressionViewManager(ReactApplicationContext reactContext) {
        callerContext = reactContext;
    }

    // SimpleViewManager reimplemented methods.
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected RNTImpressionView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new RNTImpressionView(callerContext, null);
    }

    // Commands for react native.
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("configureWithDetails", 1);
    }

    @Override
    public void receiveCommand(RNTImpressionView view, int commandType, @Nullable ReadableArray args) {
        switch (commandType) {
            case 1: {
                OfferDetail offerDetails = new OfferDetail(
                        args.getString(0),
                        args.getString(1),
                        args.getDouble(2),
                        args.getBoolean(3),
                        args.getString(4));
                view.configureWithDetails(offerDetails);
                return;
            }
            default:
                throw new IllegalArgumentException(String.format("Unsupported command %d received by %s.", commandType, getClass().getSimpleName()));
        }
    }
}
