import React, { memo, useEffect, useState, useCallback, useContext, useMemo, useLayoutEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';

import { ConnectionBanner } from '_components/ConnectionBanner';
import { Accordion } from '_components/Accordion';
import { Title, TitleType } from '_components/Title';
import { Toast, ToastType } from '_components/Toast';
import { NavigationHeader } from '_components/NavigationHeader';
import { Loading } from '_views/Loading';
import { GiftCardCode } from '_components/GiftCardCode';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getIsSameDate } from '_utils/getIsSameDate';
import { getFixedValueWithDecimals } from '_utils/getFixedValueWithDecimals';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGiftCardDetail, useGifCardApplePass, useGifCardAndroidPass, useGiftCardBalance, useGiftCards } from '_state_mgmt/giftCard';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { ENV, ForterActionType, TealiumEventType, UxObject, RedemptionMethods, PageNames, ROUTES, ICON, COLOR, FONT_SIZE } from '_constants';
import GiftCardWaterMark from '_assets/shared/sywGiftCardWaterMark.svg';
import GiftCardFallback from '_assets/shared/giftCardFallback.svg';
import SaveToGooglePay from '_assets/wallet/saveToGooglePay.svg';
import AppleWalletService from '_services/AppleWalletService';
import { getPageNameWithParams } from '_utils/trackingUtils';
import { Icon } from '_commons/components/atoms/Icon';
import { EmptyBarCode } from '_commons/components/molecules/EmptyBarCode';

import { getFormattedCheckBalanceDate } from '_utils/getFormattedCheckBalanceDate';

import { CheckBalanceModal } from './components/CheckBalanceModal/CheckBalanceModal';
import { statusType } from '_models/giftCard';
import { HeaderStatusButton } from '_views/GiftCardDetail/components/HeaderStatusButton';
import { StatusConfirmationModal } from '_modules/wallet/components/StatusConfirmationModal';
import { useGiftCardStatus } from '_state_mgmt/giftCard';

import { GiftCardListDetailSkeleton } from './components/GiftCardListDetailSkeleton';
import { styles } from './styles';
import { BrandLogo } from '_components/BrandLogo';

export interface Props {
  route: {
    params: {
      giftCardId: string;
      cardBalance: number;
      statusInd: statusType;
      cardProvider: string;
    };
  };
  navigation: StackNavigationProp<any>;
}

export const GiftCardDetail = ({
  route: {
    params: { giftCardId, cardBalance, statusInd, cardProvider }
  },
  navigation
}: Props) => {
  const {
    deps: {
      nativeHelperService: {
        clipboard: { setString },
        platform
      },
      logger
    },
    state: {
      giftCard: { giftCardsList },
      core: { routeHistory }
    }
  } = useContext(GlobalContext);
  const isIOS = useMemo(() => platform.OS === 'ios', [platform.OS]);
  const isHidden = statusInd === statusType.HIDDEN;

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(ToastType.INFO);
  const [isVisibleModalStatus, setIsVisibleModalStatus] = React.useState<boolean>(false);
  const [status, setStatus] = useState<statusType>(statusInd);
  const { trackUserEvent } = useEventTracker();

  const [onLoadGiftCard, isLoading = true, error, giftCard = null] = useGiftCardDetail();
  const [onLoadGiftCardBalance, isLoadingBalance = false, balanceError, giftCardBalance = null] = useGiftCardBalance();
  const [onLoadGiftCardsList] = useGiftCards();

  const giftCardFromList = useMemo(() => giftCardsList.find(card => card.providerCardId === giftCardId), [giftCardsList, giftCardId]);
  const cardBalanceDate = useMemo(
    () =>
      giftCardFromList?.cardBalanceCheckDt && giftCardFromList?.purchaseTs && !getIsSameDate(giftCardFromList.cardBalanceCheckDt, giftCardFromList.purchaseTs)
        ? getFormattedCheckBalanceDate(giftCardFromList.cardBalanceCheckDt)
        : '-',
    [giftCardFromList?.cardBalanceCheckDt, giftCardFromList?.purchaseTs]
  );

  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const [isLoadingBalanceData, setIsLoadingBalanceData] = useState<boolean>(false);
  const [canAddPasses, setCanAddPasses] = useState(isIOS ? false : true);
  const [getApplePass, isLoadingApplePass] = useGifCardApplePass();
  const [getAndroidPass, , , apiGoogleUrl] = useGifCardAndroidPass();
  const [setCardStatus, isLoadingSetStatus] = useGiftCardStatus();

  const { getTestIdProps } = useTestingHelper('gift-card-detail');

  const dismissToast = useCallback(() => setIsToastVisible(false), [setIsToastVisible]);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);
      setTimeout(() => dismissToast(), ENV.TOAST_VISIBLE_MS);
    },
    [dismissToast]
  );
  const hasBalanceUrl = useMemo(() => giftCard?.balance_check_url && giftCard.balance_check_url !== 'NA', [giftCard?.balance_check_url]);

  const isCheckBalanceAvailable = useMemo(() => giftCard?.balance_checks_available || hasBalanceUrl, [giftCard?.balance_checks_available, hasBalanceUrl]);

  const header = useCallback(
    (props: StackHeaderProps) => (
      <NavigationHeader
        {...props}
        headerRight={
          <HeaderStatusButton
            status={status}
            /** @todo find the way to access to the elements of the header and test the right button */ onPress={
              /* istanbul ignore next */ () => setIsVisibleModalStatus(true)
            }
          />
        }
      />
    ),
    [status]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ header });
  }, [header, navigation]);

  useEffect(() => {
    onLoadGiftCard(giftCardId);
  }, [onLoadGiftCard, giftCardId]);

  useEffect(() => {
    if (apiGoogleUrl) {
      navigation.navigate(ROUTES.GIFT_CARD_GOOGLE_PAY, { apiGoogleUrl, title: giftCard?.brandName });
    }
  }, [apiGoogleUrl, navigation, giftCard?.brandName]);

  useEffect(() => {
    if (!isIOS) return;
    AppleWalletService.canAddPasses()
      .then(value => setCanAddPasses(value))
      .catch(e => {
        logger.error('Cannot check canAddPasses', { error: e });
        setCanAddPasses(false);
      });
  }, [logger, isIOS]);

  const copyToClipboard = useCallback(
    (value: string) => {
      setString(value);
      showToast('Card Number copied to clipboard', ToastType.INFO);
    },
    [setString, showToast]
  );

  /** @todo find the way to access to the elements of the header and test the right button */
  /* istanbul ignore next */
  const onRedirectHandle = useCallback(() => {
    if (routeHistory[1] === ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN) {
      navigation.navigate(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: true });
    } else {
      navigation.goBack();
    }
  }, [navigation, routeHistory]);

  /** @todo find the way to access to the elements of the header and test the right button */
  /* istanbul ignore next */
  const onSuccessHandle = useCallback(async () => {
    const newStatus = status === statusType.ACTIVE ? statusType.HIDDEN : statusType.ACTIVE;
    const toastBottomPosition = routeHistory[1] === ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN ? 150 : undefined;
    const cardStatus = await setCardStatus(giftCardId, newStatus, cardProvider, toastBottomPosition);
    if (cardStatus !== undefined) setStatus(newStatus);

    trackUserEvent(
      TealiumEventType.WALLET,
      {
        page_name: status === statusType.ACTIVE ? PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ACTIVE : PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ARCHIVED,
        event_name: TealiumEventType.WALLET,
        uxObject: UxObject.BUTTON,
        event_type: status === statusType.ACTIVE ? TealiumEventType.GIFT_CARD_ARCHIVE : TealiumEventType.GIFT_CARD_UNARCHIVE
      },
      ForterActionType.TAP
    );
    setIsVisibleModalStatus(false);

    onRedirectHandle();
  }, [status, routeHistory, setCardStatus, giftCardId, cardProvider, trackUserEvent, onRedirectHandle]);

  const getItemBoxCard = useCallback(
    (title, value, showCopy = false) => (
      <View style={styles.itemBoxCard}>
        <Text style={styles.itemBoxCardTitle}>{title}</Text>
        <View style={styles.itemBoxCardContent}>
          <Text style={styles.itemBoxCardValue}>{value}</Text>
          {showCopy && !isHidden && (
            <Text {...getTestIdProps('copy')} onPress={() => copyToClipboard(value)} style={styles.itemBoxCopy}>
              Copy
            </Text>
          )}
        </View>
      </View>
    ),
    [isHidden, getTestIdProps, copyToClipboard]
  );

  const getItemArticle = useCallback(
    (title, value) => (
      <View style={styles.itemArticle}>
        <Title type={TitleType.SECTION} style={styles.itemArticleTitle}>
          {title}
        </Title>
        <Text style={styles.itemArticleText}>{value}</Text>
      </View>
    ),
    []
  );

  const handleApplePass = useCallback(async () => {
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        page_name: getPageNameWithParams(PageNames.WALLET.WALLET_GIFT_CARD, [giftCard?.brandName]),
        uxObject: UxObject.BUTTON,
        event_name: TealiumEventType.WALLET,
        event_type: 'apple_pay',
        event_detail: 'apple_pay_added',
        brand_name: giftCard?.brandName,
        brand_id: giftCardId
      },
      ForterActionType.TAP
    );

    const applePassFetched = await getApplePass(giftCardId);
    logger.debug(`addPassWithId RESULT: ${applePassFetched}`);
    if (applePassFetched) {
      showToast('Your Gift Card was added to the Apple Wallet', ToastType.SUCCESS);
    }
  }, [getApplePass, giftCard?.brandName, giftCardId, logger, showToast, trackUserEvent]);

  const actionGetAndroidPass = useCallback(() => {
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        uxObject: UxObject.BUTTON,
        event_name: TealiumEventType.WALLET,
        event_type: 'google_pay',
        event_detail: 'google_pay_added',
        brand_name: giftCard?.brandName,
        brand_id: giftCardId
      },
      ForterActionType.TAP
    );
    getAndroidPass(giftCardId);
  }, [getAndroidPass, giftCardId, trackUserEvent, giftCard]);

  const renderAddToWallet = useCallback(() => {
    if (!canAddPasses || isHidden) return null;

    if (!isIOS) {
      return (
        <TouchableOpacity style={styles.addToWalletContainer} onPress={actionGetAndroidPass} {...getTestIdProps('add-to-android-wallet')}>
          <SaveToGooglePay style={styles.saveToPhoneImage} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.addToWalletContainer} onPress={handleApplePass} {...getTestIdProps('add-to-apple-wallet')} disabled={isLoadingApplePass}>
        <Image source={require('_assets/wallet/addToAppleWallet.png')} style={styles.addToWalletImage as any} resizeMode={'contain'} />
      </TouchableOpacity>
    );
  }, [canAddPasses, isHidden, isIOS, handleApplePass, getTestIdProps, isLoadingApplePass, actionGetAndroidPass]);

  useEffect(() => {
    if (balanceError) {
      showToast('We can’t check your balance now.', ToastType.ERROR);
    }
  }, [balanceError, showToast]);

  const loadGiftCardBalanceData = useCallback(async () => {
    setIsLoadingBalanceData(true);
    await onLoadGiftCardBalance(giftCardId);
    await onLoadGiftCard(giftCardId);
    await onLoadGiftCardsList();
    setIsLoadingBalanceData(false);
  }, [onLoadGiftCard, onLoadGiftCardBalance, onLoadGiftCardsList, giftCardId]);

  const actionCheckBalanceWebview = useCallback(async () => {
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        uxObject: UxObject.BUTTON,
        event_name: TealiumEventType.WALLET,
        event_type: 'check_balance',
        event_detail: 'check_balance_webview',
        brand_name: giftCard?.brandName,
        brand_id: giftCardId
      },
      ForterActionType.TAP
    );
    navigation.navigate(ROUTES.GIFT_CARD_BALANCE, {
      url: giftCard.balance_check_url,
      title: giftCard?.brandName,
      cardNumber: giftCard?.cardNumber,
      pin: giftCard?.cardPin
    });
  }, [giftCard?.brandName, giftCard?.balance_check_url, giftCard?.cardNumber, giftCard?.cardPin, navigation, giftCardId, trackUserEvent]);

  const checkBalance = useCallback(async () => {
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        uxObject: UxObject.BUTTON,
        event_name: TealiumEventType.WALLET,
        event_type: 'check_balance',
        brand_name: giftCard?.brandName,
        brand_id: giftCardId
      },
      ForterActionType.TAP
    );
    if (giftCard?.balance_checks_available > 0) {
      setShowBalanceModal(true);
      return;
    }
    hasBalanceUrl && actionCheckBalanceWebview();
  }, [giftCard?.balance_checks_available, hasBalanceUrl, setShowBalanceModal, actionCheckBalanceWebview, giftCard?.brandName, giftCardId, trackUserEvent]);

  const getCardValue = useCallback(() => {
    if (isCheckBalanceAvailable) {
      if (giftCardBalance?.cardValue) {
        return `$${getFixedValueWithDecimals(giftCardBalance.cardValue, 2)}`;
      }
      if (cardBalance) {
        return `$${getFixedValueWithDecimals(cardBalance, 2)}`;
      }
      if (giftCard?.cardBalance) {
        return `$${getFixedValueWithDecimals(giftCard.cardBalance, 2)}`;
      }
    }
    return '-';
  }, [giftCardBalance?.cardValue, cardBalance, giftCard?.cardBalance, isCheckBalanceAvailable]);

  const getCheckBalance = useMemo(() => {
    return isCheckBalanceAvailable ? (
      <TouchableOpacity {...getTestIdProps('check-balance-button')} onPress={checkBalance}>
        <View style={styles.balanceContainer}>
          <Text style={styles.itemBoxCopy}>{isLoadingBalance ? 'Checking balance...' : 'Check balance'}</Text>
          {giftCard?.balance_checks_available ? null : (
            <View style={styles.iconBalanceContainer} {...getTestIdProps('icon-balance')}>
              <Icon name={ICON.EXTERNAL_LINK} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.REGULAR} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <Text {...getTestIdProps('balance-disabled')} style={styles.textDisabled}>
        Check balance unavailable
      </Text>
    );
  }, [checkBalance, getTestIdProps, giftCard?.balance_checks_available, isLoadingBalance, isCheckBalanceAvailable]);

  const checkBalanceItem = useMemo(
    () => (
      <View style={styles.itemBoxCard}>
        <Text style={styles.itemBoxCardTitle}>GIFT CARD BALANCE</Text>

        <View style={styles.itemBoxCardContent}>
          {isLoadingBalanceData ? (
            <Loading size={20} style={styles.loading} />
          ) : (
            <Text {...getTestIdProps('balance-value')} style={styles.itemBoxCardValue}>
              {getCardValue()}
            </Text>
          )}
          {!isHidden && getCheckBalance}
        </View>
      </View>
    ),
    [isLoadingBalanceData, getTestIdProps, getCardValue, isHidden, getCheckBalance]
  );

  const checkBalanceDateItem = (
    <View style={styles.itemBoxCard}>
      <Text style={styles.itemBoxCardTitle}>LAST BALANCE CHECK</Text>
      <View style={styles.itemBoxCardContent}>
        {isLoadingBalanceData ? (
          <Loading size={20} style={styles.loading} />
        ) : (
          <Text {...getTestIdProps('balance-date')} style={styles.itemBoxCardValue}>
            {cardBalanceDate}
          </Text>
        )}
      </View>
    </View>
  );

  if (isLoading && !isLoadingBalanceData) return <GiftCardListDetailSkeleton />;

  if (error) {
    return (
      <View style={styles.fallbackContainer} {...getTestIdProps('fallback')}>
        <GiftCardFallback width={80} height={80} />
        <Text style={styles.fallbackTitle}>Whoops! Something went wrong.</Text>
        <Text style={styles.fallbackSubtitle}>It looks like we can't show your Gift Card detail at this moment. Please try again later.</Text>
      </View>
    );
  }

  return (
    <>
      <ConnectionBanner />
      <ScrollView style={styles.container}>
        <View style={styles.boxCard}>
          <View style={[styles.boxCardHeader, isHidden && styles.boxCardHeaderGray]} {...getTestIdProps('box-card-header')}>
            <BrandLogo image={giftCardFromList?.brandDetails?.brandLogo} style={styles.logo} size={40} isGiftCard />
            <Text numberOfLines={1} style={styles.boxCardHeaderTitle}>
              {giftCard?.brandName}
            </Text>
          </View>

          {!isHidden && (
            <View style={styles.boxCardCover}>
              {giftCard?.barcode?.kind && giftCard.barcode.value ? (
                <>
                  <Text style={styles.boxCardCoverTitle}>Use this code to redeem your gift card</Text>
                  <GiftCardCode barcodeKind={giftCard.barcode.kind} barcodeValue={giftCard.barcode.value} style={styles.barCode} />
                </>
              ) : (
                <EmptyBarCode />
              )}
            </View>
          )}

          <View style={styles.boxCardItems}>
            {getItemBoxCard('ORDER TOTAL', `$${getFixedValueWithDecimals(giftCard?.cardValue, 2)}`)}
            {checkBalanceItem}
            {checkBalanceDateItem}
            {getItemBoxCard('CARD NUMBER', giftCard?.cardNumber, true)}
            {getItemBoxCard('PIN', giftCard?.cardPin)}
          </View>
        </View>
        {renderAddToWallet()}
        <View style={styles.article}>
          {getItemArticle('Brand description', giftCard?.description)}
          {getItemArticle('Redemption Method:', RedemptionMethods[giftCard?.redemption_configs?.kind])}

          <View style={styles.itemArticle}>
            <Accordion noUseDefaultPadding={true} textStyle={styles.termsAndConditions} title="Details & Terms">
              {giftCard?.legal_terms}
            </Accordion>
          </View>
        </View>
        <View style={styles.footer}>
          <GiftCardWaterMark />
        </View>
      </ScrollView>
      {isToastVisible && (
        <Toast onPress={dismissToast} type={toastType}>
          {toastMessage}
        </Toast>
      )}
      <CheckBalanceModal
        visible={showBalanceModal}
        loadGiftCardBalanceData={loadGiftCardBalanceData}
        onPressOutside={() => setShowBalanceModal(false)}
        checksAvailable={giftCard?.balance_checks_available ?? 0}
      />

      <StatusConfirmationModal
        name={giftCard.brandName}
        isVisible={isVisibleModalStatus}
        isLoading={isLoadingSetStatus}
        status={status}
        onDismiss={
          /** @todo find the way to access to the elements of the header and test the right button */
          /* istanbul ignore next */ () => setIsVisibleModalStatus(false)
        }
        onSuccess={onSuccessHandle}
      />
    </>
  );
};

export default memo(GiftCardDetail);
