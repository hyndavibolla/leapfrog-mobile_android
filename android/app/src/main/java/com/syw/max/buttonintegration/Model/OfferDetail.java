package com.syw.max.buttonintegration.Model;

import com.usebutton.sdk.impression.VisibleRateType;
import com.usebutton.sdk.impression.CreativeType;

public class OfferDetail {
    private String offerDetailURL;
    private String offerDetailID;
    private double offerDetailRate;
    private VisibleRateType offerDetailType;
    private CreativeType offerCreativeType;

    // Initialization.
    public OfferDetail(String url, String offerID, double rate, boolean rateIsFixed, String creativeType) {
        this.offerDetailURL = url;
        this.offerDetailID = offerID;
        this.offerDetailRate = rate;
        this.offerDetailType = (rateIsFixed) ? VisibleRateType.FIXED : VisibleRateType.PERCENT;
        this.offerCreativeType = this.getCreativeTypeFor(creativeType);
    }

    // Data functions.
    private CreativeType getCreativeTypeFor(String creativeType) {
        switch (creativeType) {
            case "hero":
                return  CreativeType.HERO;
            case "carousel":
                return CreativeType.CAROUSEL;
            case "list":
                return CreativeType.LIST;
            case "grid":
                return CreativeType.GRID;
            case "detail":
                return CreativeType.DETAIL;
        }

        return CreativeType.OTHER;
    }

    // Getters.
    public String getOfferDetailURL() {
        return this.offerDetailURL;
    }

    public String getOfferDetailID() {
        return this.offerDetailID;
    }

    public double getOfferDetailRate() {
        return this.offerDetailRate;
    }

    public VisibleRateType getOfferDetailType() {
        return this.offerDetailType;
    }

    public CreativeType getOfferCreativeType() {
        return this.offerCreativeType;
    }
}