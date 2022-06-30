import React, { memo, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Stars from 'react-native-stars';
import moment from 'moment';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGetLinkedCardsList, useValidateAndActivateLocalOffer } from '_state_mgmt/cardLink/hooks';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { inStoreOfferIsActivated } from '_utils/inStoreOfferIsActivated';
import { isNumeric } from '_utils/isNumeric';
import { Icon } from '_commons/components/atoms/Icon';
import { BannersManageCards } from '_components/BannersManageCards';
import { EventDetail, ForterActionType, PageNames, PageType, ROUTES, TealiumEventType, UxObject, ICON, FONT_SIZE, COLOR } from '_constants';
import { PRICE_RANGE_MAX_VALUE } from '_models/cardLink';
import { MapWidget } from '_components/MapWidget';
import { ExpandableText } from '_components/ExpandableText';
import { ScrollViewWithAnimatedHeader } from '_commons/components/organisms/ScrollViewWithAnimatedHeader';
import { BrandHeader } from '_components/BrandHeader/BrandHeader';
import { actions } from '_state_mgmt/cardLink/actions';

import { CloseByOffers } from './InStoreOfferCloseBy';
import { InStoreOfferCalendar } from './InStoreOfferCalendar';
import { InStoreOfferDetailHeading } from './InStoreOfferDetailHeading';
import { InStoreOfferTermsConditions } from './InStoreOfferTermsConditions';
import { InStoreOfferDetailFooter } from './InStoreOfferDetailFooter';
import styles from './styles';
import { Pill } from '_components/Pill';
const EmptyHeaderImageFallback = require('_assets/shared/missionDetailEmptyHeader.png');

export interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteWithParams;
}

interface RouteWithParams {
  params: {
    offerId: string;
  };
}

function InStoreOfferDetail({
  navigation,
  route: {
    params: { offerId }
  }
}: Props) {
  const { getTestIdProps } = useTestingHelper('in-store-offer-detail');
  const { navigate } = useNavigation();

  const {
    state: {
      cardLink: { linkedCardsList, offers, routeToActivateLocalOffer }
    },
    deps: {
      logger,
      nativeHelperService: { linking, platform }
    },
    dispatch
  } = useContext(GlobalContext);
  const [offer, setOffer] = useState(offers.find(current => current.offerId === offerId));
  const [activateOffer, isActivatingOffer] = useValidateAndActivateLocalOffer();
  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true, linkedCardsListError] = useGetLinkedCardsList();
  const { trackSystemEvent } = useEventTracker();

  useEffect(() => {
    onLoadLinkedCardsList();
  }, [onLoadLinkedCardsList]);

  useEffect(() => {
    setOffer(offers.find(current => current.offerId === offerId));
  }, [offers, offerId]);

  const {
    activeUntil,
    brandImage,
    calendar,
    brandName,
    description,
    menu: { externalUrl },
    merchant: {
      address: { latitude, longitude, street },
      priceRange,
      websiteUrl
    },
    pointsAwarded,
    rating: { overallRating }
  } = offer;

  const trackEvent = useCallback(
    (attributes: Record<string, any>) =>
      trackSystemEvent(
        TealiumEventType.OFFER,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.PROMO,
          section: ROUTES.MAIN_TAB.EARN,
          event_type: TealiumEventType.OFFER,
          event_name: TealiumEventType.IN_STORE,
          event_detail: EventDetail.ACTIVATION,
          uxObject: UxObject.BUTTON,
          brand_name: offer?.brandName,
          ...attributes
        },
        ForterActionType.TAP
      ),
    [offer?.brandName, trackSystemEvent]
  );

  const onAddressTap = useCallback(() => {
    const scheme = platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = brandName;

    trackEvent({
      event_type: TealiumEventType.EXIT,
      event_detail: JSON.stringify({ address: street }),
      uxObject: UxObject.TILE
    });

    linking
      .openURL(
        platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        })
      )
      .then(() => {
        logger.debug('Coordinates display action has been dispatched to O.S.');
      });
  }, [platform, latitude, longitude, trackEvent, street, linking, logger, brandName]);

  const hasLinkedCards = !isLoadingLinkedCardsList && !linkedCardsListError && linkedCardsList.length > 0;

  const isActivated = inStoreOfferIsActivated(offer);

  const rewardText = useMemo(() => getMissionPointsAwardedText(pointsAwarded) ?? 'Local Offer', [pointsAwarded]);

  useEffect(() => {
    if (routeToActivateLocalOffer === ROUTES.IN_STORE_OFFERS.OFFER_DETAIL && hasLinkedCards) {
      trackEvent({});
      activateOffer(offer, hasLinkedCards);
      dispatch(actions.setRouteToActivateLocalOffer(''));
    }
  }, [activateOffer, dispatch, hasLinkedCards, offer, routeToActivateLocalOffer, trackEvent]);

  const buildOperationHours = useCallback(() => {
    const currentMoment = moment();
    const currentDayOfWeek = currentMoment.format('ddd');
    const currentCalendar = calendar.find(cal => cal.dayOfWeek === currentDayOfWeek);

    if (!currentCalendar?.dayHours) return null;
    /* cspell:disable-next-line */
    const inputDateFormat = 'hh:mmaa';
    const outputDateFormat = 'h A';
    const openMark = moment(currentCalendar.dayHours.open, inputDateFormat);
    const closeMark = moment(currentCalendar.dayHours.close, inputDateFormat);

    if (!openMark.isValid()) return null;

    const isNotOpenYet = openMark.hour() > currentMoment.hour() || (openMark.hour() === currentMoment.hour() && openMark.minutes() > currentMoment.minutes());
    const isAlreadyClosed =
      closeMark.isValid() &&
      (closeMark.hour() < currentMoment.hour() || (openMark.hour() === currentMoment.hour() && closeMark.minutes() < currentMoment.minutes()));

    if (!currentCalendar.dayHours.openForBusiness || isNotOpenYet || isAlreadyClosed) {
      return (
        <View {...getTestIdProps('operation-hours-container')} style={styles.descriptionRow}>
          <Icon name={ICON.TIME} color={COLOR.DARK_GRAY} />
          <Text {...getTestIdProps('closed-label')} style={styles.closeLabel}>
            Closed
          </Text>
        </View>
      );
    }

    return (
      <View {...getTestIdProps('operation-hours-container')} style={styles.descriptionRow}>
        <Icon name={ICON.TIME} color={COLOR.DARK_GRAY} />
        <Text style={styles.descriptionLabel}>
          <Text {...getTestIdProps('opening-time')}>Opens {openMark.format(outputDateFormat)} - </Text>
          {closeMark.isValid() ? (
            <Text {...getTestIdProps('closing-time')}>{closeMark.format(outputDateFormat)}</Text>
          ) : (
            <Text {...getTestIdProps('closing-time')} style={styles.hourMightDifferLabel}>
              Closing time unknown
            </Text>
          )}
        </Text>
      </View>
    );
  }, [calendar, getTestIdProps]);

  return (
    <>
      <View style={styles.detailPage}>
        <ScrollViewWithAnimatedHeader
          containerStyle={styles.detailPageScrollView}
          header={<BrandHeader uri={brandImage} fallback={EmptyHeaderImageFallback} />}
          floatingComponent={
            <View style={styles.rowHeader}>
              <View style={styles.halfColumn}>
                <Text numberOfLines={1} style={styles.floatingText}>
                  {brandName}
                </Text>
              </View>
              <Pill textFallback={'Local Offer'} isDisabled={!isActivated}>
                {rewardText}
              </Pill>
            </View>
          }
          floatingComponentLeftPosition={99}
        >
          <InStoreOfferDetailHeading
            isActive={isActivated}
            activeUntil={activeUntil}
            name={brandName}
            rewardText={getMissionPointsAwardedText(pointsAwarded) ?? 'Local Offer'}
          />
          <View style={styles.detailContainer}>
            <View style={[styles.detailSection, styles.actionsLine]}>
              {websiteUrl?.length ? (
                <TouchableOpacity
                  {...getTestIdProps('web-url')}
                  onPress={() => {
                    trackEvent({
                      event_type: TealiumEventType.EXIT,
                      event_detail: JSON.stringify({ storeUrl: websiteUrl }),
                      uxObject: UxObject.TILE,
                      exit_link: websiteUrl
                    });
                    navigate(ROUTES.IN_STORE_OFFERS.WEB_VIEW, { uri: websiteUrl, title: brandName });
                  }}
                  style={styles.action}
                >
                  <Text style={styles.actionText}>View Website</Text>
                </TouchableOpacity>
              ) : null}
              {websiteUrl?.length && externalUrl?.length ? <View style={styles.separator} /> : null}
              {externalUrl?.length ? (
                <TouchableOpacity
                  {...getTestIdProps('menu-url')}
                  onPress={() => {
                    trackEvent({
                      event_type: TealiumEventType.EXIT,
                      event_detail: JSON.stringify({ menu: externalUrl }),
                      uxObject: UxObject.TILE,
                      exit_link: websiteUrl
                    });
                    navigate(ROUTES.IN_STORE_OFFERS.WEB_VIEW, { uri: externalUrl, title: brandName });
                  }}
                  style={styles.action}
                >
                  <Text style={styles.actionText}>View Menu</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {description?.length ? <ExpandableText text={description} numberOfLines={3} /> : null}
            <MapWidget offer={offer} onPress={onAddressTap} isActive={isActivated} numberOfStars={overallRating || null} />
            {street?.length ? (
              <TouchableOpacity {...getTestIdProps('address')} style={[styles.descriptionRow, styles.hotlinkMap]} onPress={onAddressTap}>
                <Icon name={ICON.LOCATION} size={FONT_SIZE.REGULAR} />
                <View>
                  <Text numberOfLines={1} style={[styles.descriptionLabel, styles.hotlinkMapText]}>
                    {street}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {buildOperationHours()}
            {isNumeric(priceRange) ? (
              <View {...getTestIdProps('meal-values-container')} style={styles.descriptionRow}>
                <Icon name={ICON.FOOD} color={COLOR.DARK_GRAY} size={FONT_SIZE.SMALL} />
                <Text style={styles.descriptionLabel}>Average price: </Text>
                <Stars
                  disabled
                  default={Number(priceRange)}
                  count={PRICE_RANGE_MAX_VALUE}
                  starSize={20}
                  spacing={1}
                  fullStar={<Text style={styles.fullDollar}>$</Text>}
                  emptyStar={<Text style={styles.emptyDollar}>$</Text>}
                />
              </View>
            ) : null}
          </View>

          {offer?.benefits ? <InStoreOfferCalendar offerBenefits={offer.benefits} /> : null}
          <View style={styles.scroll}>
            <View style={styles.container}>
              <BannersManageCards />
              <CloseByOffers offerId={offerId} disabled={isActivatingOffer} navigation={navigation} />
            </View>
            <InStoreOfferTermsConditions isActive={isActivated} />
          </View>
        </ScrollViewWithAnimatedHeader>
        <InStoreOfferDetailFooter
          rewardText={rewardText}
          isActive={isActivated}
          disabled={isActivatingOffer}
          onActivateRequested={() => {
            trackEvent({});
            activateOffer(offer, hasLinkedCards);
          }}
        />
      </View>
    </>
  );
}

export default memo(InStoreOfferDetail);
