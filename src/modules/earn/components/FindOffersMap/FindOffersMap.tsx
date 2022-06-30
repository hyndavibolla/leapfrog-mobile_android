import React, { useCallback, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ErrorBoundary from '_components/ErrorBoundary';
import { MapCard } from '_components/MapCard';
import { BannerAddCards } from '_components/BannerAddCards';
import { ToastType } from '_components/Toast';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useLocationPermission } from '_utils/useLocationPermission';
import { useAsyncCallback } from '_utils/useAsyncCallback';

import { ROUTES, ENV, TealiumEventType, UxObject, ForterActionType, PageNames } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker, useToast } from '_state_mgmt/core/hooks';

import { styles } from './styles';

const FindOffersMap = () => {
  const { getTestIdProps } = useTestingHelper('earn-main-find-offers-map');
  const {
    state: {
      core: { isTutorialVisible }
    },
    deps
  } = useContext(GlobalContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLocationAvailable, isLocationBlocked, handleLocationPermission } = useLocationPermission();
  const { showToast } = useToast();
  const { trackUserEvent } = useEventTracker();
  const [onGetShouldShowOffers, , , shouldShowOffers = false] = useAsyncCallback<any, boolean>(
    () => deps.nativeHelperService.storage.get(ENV.STORAGE_KEY.SHOW_OFFERS_ON_EARN_MAIN),
    []
  );

  useEffect(() => {
    onGetShouldShowOffers();
  }, [onGetShouldShowOffers]);

  const showOfferList = useCallback(async () => {
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.SHOW_OFFERS_ON_EARN_MAIN, true);
    await onGetShouldShowOffers();
  }, [deps.nativeHelperService.storage, onGetShouldShowOffers]);

  const handlePressEnabledButtonMap = useCallback(async () => {
    const permission = await handleLocationPermission();
    trackUserEvent(
      TealiumEventType.LOCATION,
      {
        page_name: PageNames.MAIN.EARN,
        event_type: TealiumEventType.LOCATION,
        event_name: TealiumEventType.IN_STORE,
        uxObject: UxObject.BUTTON
      },
      ForterActionType.TAP
    );
    if (permission === deps.nativeHelperService.reactNativePermission.RESULTS.GRANTED) {
      showToast({ type: ToastType.SUCCESS, children: 'Location enabled successfully!' });
    }
  }, [deps.nativeHelperService.reactNativePermission.RESULTS.GRANTED, handleLocationPermission, showToast, trackUserEvent]);

  const handlePressExploreButtonMap = useCallback(() => {
    trackUserEvent(
      TealiumEventType.LOCATION,
      {
        page_name: PageNames.MAIN.EARN,
        event_type: TealiumEventType.LOCATION,
        event_name: TealiumEventType.IN_STORE,
        uxObject: UxObject.BUTTON
      },
      ForterActionType.TAP
    );
    navigation.push(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
  }, [navigation, trackUserEvent]);

  const navigateToInStoreOffersCardLink = useCallback(() => navigation.navigate(ROUTES.IN_STORE_OFFERS.CARD_LINK), [navigation]);

  return (
    <View style={styles.sectionMain} {...getTestIdProps('section-container')}>
      <ErrorBoundary>
        <View {...getTestIdProps('section')}>
          <MapCard
            isLocationEnabled={isLocationAvailable}
            isLocationPermissionBlocked={isLocationBlocked}
            onPressEnabledButton={handlePressEnabledButtonMap}
            onPressExploreButton={handlePressExploreButtonMap}
          />
        </View>
      </ErrorBoundary>

      {isLocationAvailable && !isTutorialVisible && (
        <BannerAddCards shouldShowOffers={shouldShowOffers} onShowOffersPressed={showOfferList} onPressAddCardButton={navigateToInStoreOffersCardLink} />
      )}
    </View>
  );
};

export default FindOffersMap;
