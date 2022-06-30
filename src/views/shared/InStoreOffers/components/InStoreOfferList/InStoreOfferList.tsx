import React, { memo, useContext, useCallback, useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { EventDetail, ForterActionType, PageNames, PageType, ROUTES, TealiumEventType, UxObject } from '_constants';
import { ICardLinkOffer } from '_models/cardLink';
import { useValidateAndActivateLocalOffer } from '_state_mgmt/cardLink/hooks';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { actions } from '_state_mgmt/cardLink/actions';

import { InStoreOffer } from '_components/InStoreOffers/components/InStoreOffer';
import { NearbyInStoreOffer } from '_components/InStoreOffers/components/NearbyInStoreOffer';

export interface Props {
  hasLinkedCards: boolean;
  allowNavigation?: boolean;
  disabled?: boolean;
  onOfferSelected?: (selectedOffer: ICardLinkOffer, index: number) => void;
  buildItemStyle: (item: ICardLinkOffer, index: number) => StyleProp<ViewStyle>;
  buildItemShowStreet?: (item: ICardLinkOffer) => boolean;
}

const InStoreOfferList = ({ hasLinkedCards, allowNavigation = true, disabled, onOfferSelected, buildItemStyle, buildItemShowStreet }: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-list');
  const { trackSystemEvent } = useEventTracker();
  const [currentOffer, setCurrentOffer] = useState<ICardLinkOffer>(undefined);
  const [activateOffer, isActivatingAnOffer] = useValidateAndActivateLocalOffer();

  const {
    state: {
      cardLink: { offers, routeToActivateLocalOffer }
    },
    dispatch
  } = useContext(GlobalContext);

  const trackEvent = useCallback(
    (offerBrandName: string) =>
      trackSystemEvent(
        TealiumEventType.OFFER,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.SELECTION,
          section: ROUTES.MAIN_TAB.EARN,
          event_type: TealiumEventType.OFFER,
          event_name: TealiumEventType.IN_STORE,
          event_detail: EventDetail.ACTIVATION,
          uxObject: UxObject.LIST,
          brand_name: offerBrandName
        },
        ForterActionType.TAP
      ),
    [trackSystemEvent]
  );

  useEffect(() => {
    if (routeToActivateLocalOffer === ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP && hasLinkedCards && currentOffer) {
      trackEvent(currentOffer.brandName);
      activateOffer(currentOffer, hasLinkedCards);
      dispatch(actions.setRouteToActivateLocalOffer(''));
    }
  }, [activateOffer, currentOffer, dispatch, hasLinkedCards, routeToActivateLocalOffer, trackEvent]);

  const onActivateOfferHandle = (offer: ICardLinkOffer) => {
    trackEvent(offer.brandName);
    activateOffer(offer, hasLinkedCards);
    setCurrentOffer(offer);
  };

  return (
    <>
      {offers.map((offer, index) => {
        return allowNavigation ? (
          <InStoreOffer
            {...getTestIdProps('item')}
            key={offer.offerId}
            offer={offer}
            disabled={disabled || isActivatingAnOffer}
            style={buildItemStyle(offer, index)}
            onActivatePressed={() => {
              onActivateOfferHandle(offer);
            }}
          />
        ) : (
          <NearbyInStoreOffer
            key={offer.offerId}
            offer={offer}
            disabled={disabled}
            style={buildItemStyle(offer, index)}
            showStreet={buildItemShowStreet?.(offer)}
            onPress={() => onOfferSelected(offer, index)}
          />
        );
      })}
    </>
  );
};

export default memo(InStoreOfferList);
