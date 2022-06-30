import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import sanitizeHtml from 'sanitize-html';
import Image from 'react-native-fast-image';

import OnlineProgress from '_assets/missions/online-progress.svg';
import CloseWhite from '_assets/button/closeWhite.svg';
import { Text } from '_components/Text';
import { Pill } from '_components/Pill';
import { Button } from '_components/Button';
import { ToastType } from '_components/Toast';
import { BrandLogo } from '_components/BrandLogo';
import ErrorBoundary from '_components/ErrorBoundary';
import { ImpressionView } from '_components/ImpressionView';
import { ImageBackground } from '_components/ImageBackground';
import { ConnectionBanner } from '_components/ConnectionBanner';
import { Divider } from '_components/Divider';
import { MissionDetailSkeleton } from './components/MissionDetailSkeleton';
import { StreakDetailCard } from '_components/StreakDetailCard';
import { Title } from '_components/Title';
import { BrandHeader } from '_components/BrandHeader/BrandHeader';
import { Modal, ModalSize, ModalTitle, ModalSubtitle } from '_components/Modal';
import { Icon } from '_commons/components/atoms/Icon';
import { Tag } from '_commons/components/atoms/Tag';
import { ToggleContent } from '_commons/components/molecules/ToggleContent';
import { ScrollViewWithAnimatedHeader } from '_commons/components/organisms/ScrollViewWithAnimatedHeader';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGetStreakList } from '_state_mgmt/streak/hooks';
import { useGetMissionByBrandRequestorId } from '_state_mgmt/mission/hooks';
import { useToast, useEventTracker, useMissionModal } from '_state_mgmt/core/hooks';
import { MissionModel } from '_models';
import { LogMethod } from '_services/Logger';
import { ButtonCreativeType } from '_models/general';
import {
  COLOR,
  CONTAINER_STYLE,
  ENV,
  FONT_FAMILY,
  FONT_SIZE,
  ForterActionType,
  ICON,
  LINE_HEIGHT,
  PageNames,
  PageType,
  ROUTES,
  TealiumEventType,
  UxObject
} from '_constants';
import { getPageNameWithParams } from '_utils/trackingUtils';
import { getMissionPointsAwardedText } from '_utils/getMissionPointsAwardedText';
import { getVisibleRateForButton } from '_utils/getVisibleRateForButton';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getSortedConditions } from '_utils/getSortedConditions';
import { getBrandName } from '_utils/mapBrand';

import { styles } from './styles';
import { useRecentlyViewedMissions } from '_modules/missions/hooks/useSetRecentViewedMissions/useRecentlyViewedMissions';

export interface Props {
  route: { params: { uuid?: string; brandRequestorId?: string; isAvailableStreakIndicator?: boolean } };
  navigation: StackNavigationProp<any>;
}

export const MissionDetail = ({ route, navigation }: Props) => {
  const { state, deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('mission-detail');
  const { showToast } = useToast();
  const { trackView, trackUserEvent } = useEventTracker();
  const [onGetStreakList, , , streakList = []] = useGetStreakList();
  const [attemptedPurchase, setAttemptedPurchase] = useState<boolean>(false);
  const [postPurchaseModalVisible, setPostPurchaseModalVisible] = useState<boolean>(false);
  const [isNestedOffersModalVisible, setIsNestedOffersModalVisible] = useState<boolean>(false);
  const { restoreMissionModal, setMissionModal } = useMissionModal();
  const [onRestoreMissionModal] = restoreMissionModal;
  const [onSetMissionModal] = setMissionModal;
  const pointsPerCent = state.game.current.missions.pointsPerCent;
  const { missionMap } = state.mission;
  const uuid = route?.params?.uuid;
  const brandRequestorId = route?.params?.brandRequestorId;
  const mission: MissionModel.IMission = missionMap[uuid] || Object.values(missionMap).find(m => m.brandRequestorId === brandRequestorId);
  const [onGetMission, isGettingMission = !!brandRequestorId && !mission] = useGetMissionByBrandRequestorId();
  const impressionRef = useRef<ImpressionView>();
  const postPurchaseTimeoutRef = useRef<number>(null);
  const { setRecentlyViewedItem } = useRecentlyViewedMissions(ENV.STORAGE_KEY.RECENTLY_VIEWED_MISSIONS);

  const matchingStreakList = useMemo(
    () => streakList.filter(streak => mission?.pointsAwarded.conditions.some(condition => condition.rewardOfferCode === streak.rewardOfferCode)),
    [streakList, mission]
  );
  const minNestedConditions = 3;

  const onShopNowTap = useCallback(() => {
    setRecentlyViewedItem(mission.brandRequestorId);
    if (!mission.callToActionUrl) {
      deps.logger.warn('Offer has a null callToActionUrl', { mission });
      setIsNestedOffersModalVisible(false);
      showToast({ type: ToastType.ERROR, title: null, children: 'Whoops! Something went wrong', positionFromBottom: 85 });
      return;
    }

    setAttemptedPurchase(true);

    trackUserEvent(
      TealiumEventType.EXIT_TO_AFFILIATE_BRAND,
      {
        page_name: getPageNameWithParams(PageNames.EARN.MISSION_DETAIL, [mission.brandName]),
        page_type: PageType.PROMO,
        address: `${ENV.SCHEME}${ROUTES.GIFT_CARD_CHECKOUT}`,
        event_type: mission.brandName,
        event_detail: mission.offerId,
        uxObject: UxObject.BUTTON,
        brand_name: mission.brandName,
        brand_id: mission.brandRequestorId,
        brand_category: mission.brandCategories[0],
        exit_link: mission.callToActionUrl
      },
      ForterActionType.TAP
    );

    deps.nativeHelperService.buttonSdk.purchaseRequest(
      mission.callToActionUrl,
      mission.offerId,
      mission.pubRef ?? '',
      (error: string, errorDetail: string, purchasePath: string) => {
        deps.logger.error(error, { mission, errorDetail, purchasePath });
        setIsNestedOffersModalVisible(false);
        showToast({ type: ToastType.ERROR, title: null, children: 'Whoops! Something went wrong', positionFromBottom: 85 });
      }
    );
  }, [setRecentlyViewedItem, mission, trackUserEvent, deps.nativeHelperService.buttonSdk, deps.logger, showToast]);

  const onClosePurchaseModal = useCallback(() => {
    setPostPurchaseModalVisible(false);
    onSetMissionModal(true);
  }, [onSetMissionModal]);

  useEffect(() => {
    mission &&
      deps.logger.assert(
        LogMethod.WARN,
        !Object.values(MissionModel.RedemptionType).includes(mission.pointsAwarded.rewardType),
        `Invalid rewardType value: ${mission.pointsAwarded.rewardType} for offer: ${mission.offerId}`
      );
    impressionRef?.current?.configureWithDetails(
      mission.callToActionUrl,
      mission.uuid,
      getVisibleRateForButton(mission.pointsAwarded, pointsPerCent),
      mission.pointsAwarded.rewardType === MissionModel.RedemptionType.FIXED_POINTS,
      ButtonCreativeType.DETAIL
    );
  }, [impressionRef, mission, pointsPerCent, deps.logger, state.mission.buttonUserId, impressionRef?.current?.configureWithDetails]);

  useEffect(() => {
    if (!mission) return;
    const brandCategory = !mission.brandCategories ? null : { brand_category: mission.brandCategories[0] };
    trackView(ROUTES.MISSION_DETAIL, {
      page_name: getPageNameWithParams(PageNames.EARN.MISSION_DETAIL, [mission.brandName]),
      brand_name: mission.brandName,
      ...brandCategory,
      brand_id: mission.brandRequestorId
    });
  }, [trackView, mission]);

  useEffect(() => {
    if (postPurchaseModalVisible || !attemptedPurchase) return;
    setAttemptedPurchase(false);
    postPurchaseTimeoutRef.current = setTimeout(() => setPostPurchaseModalVisible(true), ENV.PURCHASE_MODAL_TIMEOUT_MS) as unknown as number;
  }, [postPurchaseModalVisible, attemptedPurchase]);

  useEffect(() => () => clearTimeout(postPurchaseTimeoutRef.current), []);

  useEffect(() => {
    onRestoreMissionModal();
  }, [onRestoreMissionModal]);

  useEffect(() => {
    onGetStreakList();
  }, [onGetStreakList]);

  useEffect(() => {
    if (!mission && brandRequestorId) onGetMission(brandRequestorId);
  }, [brandRequestorId, mission, onGetMission]);

  const sortedConditions = getSortedConditions(mission?.pointsAwarded?.conditions, pointsPerCent);
  if (sortedConditions?.filter(condition => condition.category === '').length > 1) {
    deps.logger.warn('Offer has multiple conditions without category', { offerId: mission.offerId, mission });
  }

  const getNestedOffers = useCallback(
    (showFull = false) => {
      const displayedOffers = showFull ? sortedConditions.length : minNestedConditions;
      const categoryLines = showFull ? 0 : minNestedConditions - 1;
      return sortedConditions.slice(0, displayedOffers).map((condition, i) => (
        <View key={i} style={styles.nestedOfferContainer}>
          <View style={styles.halfColumn}>
            <Text color={COLOR.BLACK} font={FONT_FAMILY.MEDIUM} lineHeight={LINE_HEIGHT.BIG} size={FONT_SIZE.SMALLER} numberOfLines={categoryLines}>
              {condition.category || 'All others'}
            </Text>
          </View>
          <View style={styles.pillsContainer}>
            <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(condition)}</Pill>
          </View>
        </View>
      ));
    },
    [sortedConditions]
  );

  if (isGettingMission) return <MissionDetailSkeleton />;

  if (!mission)
    return (
      <View style={styles.emptyStateContainer} {...getTestIdProps('empty-state')}>
        <ImageBackground containerStyle={styles.emptyStateHeader} source={require('_assets/shared/missionDetailEmptyHeader.png')}>
          <View style={styles.emptyStateHeaderContent}>
            <Button
              onPress={navigation.goBack}
              {...getTestIdProps('close-btn')}
              containerColor={COLOR.BLACK}
              innerContainerStyle={[CONTAINER_STYLE.shadow, { width: 35, height: 35 }]}
            >
              <CloseWhite width={10} height={10} />
            </Button>
          </View>
        </ImageBackground>
        <View style={styles.emptyStateBody}>
          <Icon name={ICON.CUSTOM_SEARCH} size={FONT_SIZE.XXL} backgroundStyle={styles.iconBackground} innerBackgroundStyle={styles.iconInnerBackground} />
          <Title style={styles.emptyStateTitle}>
            Whoops! This offer is not available{'\n'}
            at this time
          </Title>
          <Text style={styles.emptyStateSubtitle}>
            Sorry, we're updating this section. {'\n'}
            You can explore our catalog to find other amazing offers in the Earn section! 🚀
          </Text>
        </View>
      </View>
    );

  /** sanitizing the html on mission.termsAndConditions to remove all the html tags */
  const termsAndConditionsText = sanitizeHtml(mission.termsAndConditions, { allowedTags: [], disallowedTagsMode: 'discard' });

  return (
    <>
      <ScrollViewWithAnimatedHeader
        header={<BrandHeader uri={mission?.image} />}
        floatingComponent={
          <View style={styles.rowHeader}>
            <View style={styles.halfColumn}>
              <Text numberOfLines={1} style={styles.floatingTitle}>
                {getBrandName(mission.brandName)}
              </Text>
            </View>
            <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(mission.pointsAwarded)}</Pill>
          </View>
        }
      >
        <ConnectionBanner />
        <View style={styles.contentContainer}>
          <View style={styles.subHeader}>
            <BrandLogo image={mission?.brandLogo} category={mission?.pointsAwarded?.conditions[0]?.category} style={styles.logoImage} />
            <View style={styles.brandInfoContainer}>
              <Text color={COLOR.BLACK} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.BIG} size={FONT_SIZE.REGULAR} {...getTestIdProps('brand-name')}>
                {getBrandName(mission.brandName)}
              </Text>
              <View style={styles.subTitleContainer}>
                <Pill textFallback={'Mission'}>{getMissionPointsAwardedText(mission.pointsAwarded)}</Pill>
                <Tag>Online Offer</Tag>
              </View>
            </View>
          </View>
          <Divider containerStyle={[styles.clearDividerPadding, styles.contentSpace]} />
          <View style={styles.contentSpace}>
            <ErrorBoundary>
              {(() => {
                /** there is a bug with button integration on RNTImpressionView component when it's used to wrap several components inside the same view. [LEAP-1475] */
                const missionDescription = (
                  <Text
                    color={COLOR.DARK_GRAY}
                    font={FONT_FAMILY.MEDIUM}
                    lineHeight={LINE_HEIGHT.PARAGRAPH}
                    size={FONT_SIZE.PETITE}
                    {...getTestIdProps('brand-description')}
                  >
                    {mission.brandDescription}
                  </Text>
                );
                return deps.nativeHelperService.platform.select({
                  ios: <ImpressionView ref={impressionRef}>{missionDescription}</ImpressionView>,
                  android: <ImpressionView ref={impressionRef}>{missionDescription}</ImpressionView>,
                  default: missionDescription
                });
              })()}
            </ErrorBoundary>
          </View>
          {matchingStreakList.slice(0, 1).map(streak => (
            <View style={styles.contentSpace} key={streak.rewardOfferCode}>
              <StreakDetailCard streak={streak} brandName={getBrandName(mission.brandName)} />
            </View>
          ))}
          {!sortedConditions.length ? null : (
            <View style={[styles.contentSpace]} {...getTestIdProps('nested-offers')}>
              <View style={styles.rowHeader}>
                <Text color={COLOR.BLACK} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.MEDIUM} size={FONT_SIZE.SMALLER}>
                  Category points rates
                </Text>
                {sortedConditions.length <= minNestedConditions ? null : (
                  <TouchableOpacity onPress={() => setIsNestedOffersModalVisible(true)} {...getTestIdProps('see-more-offers-btn')}>
                    <Text color={COLOR.PRIMARY_BLUE} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.REGULAR} size={FONT_SIZE.SMALLER}>
                      See more
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {getNestedOffers()}
            </View>
          )}
        </View>
        <View style={styles.missionInfoContainer}>
          <ToggleContent title="How to earn points" titleColor={COLOR.BLACK} titleSize={FONT_SIZE.PETITE}>
            <>
              <View style={styles.progressContainer}>
                <OnlineProgress />
              </View>
              <Text>
                Click "Shop Now" to head to the merchant's store and make a purchase. If you made the purchase, within 24 to 48 hours you will have the Shop
                Your Way points to use as you wish.
              </Text>
            </>
          </ToggleContent>
          {mission.termsAndConditions ? (
            <View style={styles.termsSection}>
              <ToggleContent title="Terms & Conditions" titleColor={COLOR.BLACK} titleSize={FONT_SIZE.PETITE}>
                <View style={styles.termsContent}>
                  <Text color={COLOR.DARK_GRAY} font={FONT_FAMILY.MEDIUM} lineHeight={LINE_HEIGHT.SMALL} size={FONT_SIZE.TINY}>
                    {termsAndConditionsText}
                  </Text>
                </View>
              </ToggleContent>
            </View>
          ) : null}
        </View>
      </ScrollViewWithAnimatedHeader>
      {Platform.OS === 'android' ? <View style={styles.footerShadow} {...getTestIdProps('footer-border')} /> : null}
      <View style={styles.footer} {...getTestIdProps('footer')}>
        <Button
          textStyle={styles.buttonText}
          onPress={onShopNowTap}
          textColor={COLOR.WHITE}
          containerColor={COLOR.PRIMARY_BLUE}
          innerContainerStyle={CONTAINER_STYLE.shadow}
          style={styles.button}
          {...getTestIdProps('shop-btn')}
        >
          {['Shop Now', () => <Icon name={ICON.ARROW_RIGHT} color={COLOR.WHITE} size={FONT_SIZE.SMALL} />]}
        </Button>
      </View>
      <Modal visible={!state.core.hasSeenMissionModal && postPurchaseModalVisible} size={ModalSize.EXTRA_LARGE} onClose={onClosePurchaseModal}>
        <ScrollView {...getTestIdProps('purchase-modal')}>
          <View style={styles.purchaseHeader}>
            <Image style={styles.purchaseLogo as any} source={{ uri: mission.brandLogo }} resizeMode="cover" />
            <Text font={FONT_FAMILY.HEAVY} style={styles.purchasePlus}>
              +
            </Text>
            <Image style={styles.purchaseLogo as any} source={require('_assets/shared/swyLogo.png')} resizeMode="cover" />
          </View>
          <ModalTitle>Thanks for shopping with {getBrandName(mission.brandName)}!</ModalTitle>
          <ModalSubtitle>If you made a purchase, please check back in a few days 🗓️ to see your new points reflected.</ModalSubtitle>
          <ModalSubtitle>Cancellations, refunds and returns will not contribute to your points.</ModalSubtitle>
          <Button
            style={styles.purchaseAcceptBtn}
            innerContainerStyle={styles.purchaseAcceptBtnInnerContainer}
            onPress={onClosePurchaseModal}
            {...getTestIdProps('purchase-accept-btn')}
          >
            <Text font={FONT_FAMILY.BOLD} style={styles.purchaseAcceptBtnText}>
              Ok
            </Text>
          </Button>
        </ScrollView>
      </Modal>
      <Modal style={styles.modal} visible={isNestedOffersModalVisible} size={ModalSize.EXTRA_LARGE} onPressOutside={() => setIsNestedOffersModalVisible(false)}>
        <BrandLogo image={mission?.brandLogo} category={mission?.pointsAwarded?.conditions[0]?.category} style={styles.logoImage} />
        <View style={styles.modalTitleContainer}>
          <Text color={COLOR.BLACK} font={FONT_FAMILY.HEAVY} lineHeight={LINE_HEIGHT.BIG} size={FONT_SIZE.REGULAR}>
            Category point rates
          </Text>
        </View>
        <ScrollView style={styles.nestedModalOffersModal} showsVerticalScrollIndicator={false} {...getTestIdProps('nested-offers-modal')}>
          {getNestedOffers(true)}
        </ScrollView>

        <Button
          textStyle={styles.buttonText}
          onPress={onShopNowTap}
          textColor={COLOR.WHITE}
          containerColor={COLOR.PRIMARY_BLUE}
          style={[styles.button, styles.modalButton]}
          {...getTestIdProps('shop-btn')}
        >
          {['Shop Now', () => <Icon name={ICON.ARROW_RIGHT} color={COLOR.WHITE} size={FONT_SIZE.SMALL} />]}
        </Button>
        <TouchableHighlight onPress={() => setIsNestedOffersModalVisible(false)} underlayColor="transparent" {...getTestIdProps('nested-offers-cancel-btn')}>
          <Text color={COLOR.PRIMARY_BLUE} font={FONT_FAMILY.MEDIUM} lineHeight={LINE_HEIGHT.PARAGRAPH} size={FONT_SIZE.PETITE}>
            Cancel
          </Text>
        </TouchableHighlight>
      </Modal>
    </>
  );
};

export default memo(MissionDetail);
