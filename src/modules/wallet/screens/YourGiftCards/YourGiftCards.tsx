import React, { memo, useContext, useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

import { Button } from '_components/Button';
import { GiftCard } from '_views/WalletMain/components/GiftCard';
import { SwipeItem } from '_commons/components/molecules/SwipeItem';
import { Icon } from '_commons/components/atoms/Icon';
import { StatusConfirmationModal } from '_modules/wallet/components/StatusConfirmationModal';
import { getPageNameByRoute } from '_utils/trackingUtils';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useGiftCardStatus } from '_state_mgmt/giftCard';
import { IGiftCard, statusType, IGiftCardStatus } from '_models/giftCard';
import { ROUTES, ICON, ForterActionType, PageNames, TealiumEventType, UxObject, COLOR, FONT_SIZE } from '_constants';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEventTracker } from '_state_mgmt/core/hooks';

import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
  route?: {
    params: {
      showYourGiftCards?: boolean;
    };
  };
}

export const YourGiftCards = ({ navigation, route }: Props) => {
  const { showYourGiftCards } = route.params;
  const { trackUserEvent, trackView } = useEventTracker();
  const { getTestIdProps } = useTestingHelper('wallet-your-gc');
  const {
    state: {
      giftCard: { giftCardsList }
    },
    deps: {
      nativeHelperService: { platform },
      eventTrackerService: { rZero }
    }
  } = useContext(GlobalContext);

  const [isGiftCardsActive, setIsGiftCardsActive] = useState<boolean>(true);
  const [giftCardsFiltered, setGiftCardsFiltered] = useState<IGiftCard[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [giftCardName, setGiftCardName] = useState<string>('');
  const [giftCardStatus, setGiftCardStatus] = useState<IGiftCardStatus>({ id: '', status: undefined, cardProvider: '' });

  const [setCardStatus, isLoading] = useGiftCardStatus();

  const trackEvent = useCallback(
    (isEntering: boolean) => {
      const currentRouteName = isGiftCardsActive
        ? ROUTES.WALLET_YOUR_GIFT_CARDS.TAB_YOUR_GIFT_CARDS_ACTIVE
        : ROUTES.WALLET_YOUR_GIFT_CARDS.TAB_YOUR_GIFT_CARDS_ARCHIVED;

      if (isEntering) trackView(currentRouteName as string);
      rZero.trackView(getPageNameByRoute(currentRouteName), isEntering);
    },
    [isGiftCardsActive, rZero, trackView]
  );

  useFocusEffect(
    useCallback(() => {
      return () => trackEvent(false);
    }, [trackEvent])
  );

  useLayoutEffect(() => {
    const giftCards = giftCardsList.filter(({ statusInd }) => statusInd === (isGiftCardsActive ? statusType.ACTIVE : statusType.HIDDEN));
    setGiftCardsFiltered(giftCards);
    trackEvent(true);
  }, [giftCardsList, isGiftCardsActive, trackEvent]);

  useEffect(() => {
    if (showYourGiftCards !== undefined) setIsGiftCardsActive(showYourGiftCards);
  }, [showYourGiftCards]);

  const keyExtractor = useCallback((item: IGiftCard) => `${item.providerCardId}-${item.providerBrandId}`, []);

  const goToGiftCardDetail = useCallback(
    ({
      providerCardId,
      brandName,
      cardBalance,
      statusInd,
      cardProvider
    }: {
      providerCardId: string;
      brandName: string;
      cardBalance: number;
      statusInd: statusType;
      cardProvider: string;
    }) =>
      navigation.navigate(ROUTES.GIFT_CARD_LIST_DETAIL, {
        giftCardId: providerCardId,
        title: brandName,
        cardBalance,
        statusInd,
        cardProvider
      }),
    [navigation]
  );

  const onTapHandle = useCallback((id: string, cardProvider: string, status: statusType, name: string) => {
    setGiftCardStatus({ id, status, cardProvider });
    setGiftCardName(name);
    setIsVisibleModal(true);
  }, []);

  const onSuccessHandle = useCallback(async () => {
    const newStatus = giftCardStatus.status === statusType.ACTIVE ? statusType.HIDDEN : statusType.ACTIVE;
    await setCardStatus(giftCardStatus.id, newStatus, giftCardStatus.cardProvider, 150);
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        page_name: isGiftCardsActive ? PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ACTIVE : PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ARCHIVED,
        event_name: TealiumEventType.WALLET,
        uxObject: UxObject.BUTTON,
        event_type: giftCardStatus.status === statusType.ACTIVE ? TealiumEventType.GIFT_CARD_ARCHIVE : TealiumEventType.GIFT_CARD_UNARCHIVE
      },
      ForterActionType.TAP
    );

    setIsVisibleModal(false);
  }, [giftCardStatus, setCardStatus, isGiftCardsActive, trackUserEvent]);

  const renderItem = useCallback(
    ({
      item: {
        providerCardId,
        providerBrandId,
        cardValue,
        cardBalance,
        cardBalanceCheckDt,
        purchaseTs,
        statusInd,
        cardProvider,
        brandDetails: { brandName, brandLogo, faceplateUrl }
      }
    }) => {
      const isActiveGiftCard = statusInd === statusType.ACTIVE;
      const key = `${providerCardId}-${providerBrandId}`;
      if (platform.OS === 'android') {
        return (
          <GiftCard
            key={key}
            name={brandName}
            value={cardValue}
            cardBalance={cardBalance}
            cardBalanceCheckDt={cardBalanceCheckDt}
            purchaseTs={purchaseTs}
            onPress={() => goToGiftCardDetail({ providerCardId, brandName, cardBalance, statusInd, cardProvider })}
            onLongPress={() => onTapHandle(providerCardId, cardProvider, statusInd, brandName)}
            brandLogo={brandLogo}
            faceplateUrl={faceplateUrl}
          />
        );
      }
      return (
        <SwipeItem
          key={key}
          onTapRight={() => onTapHandle(providerCardId, cardProvider, statusInd, brandName)}
          iconLeft={isActiveGiftCard ? ICON.FOLDER_ARROW_DOWN : ICON.FOLDER_ARROW_UP}
          textLeft={isActiveGiftCard ? 'Archive' : 'Unarchive'}
          backgroundColor={isActiveGiftCard ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE}
        >
          <GiftCard
            name={brandName}
            value={cardValue}
            cardBalance={cardBalance}
            cardBalanceCheckDt={cardBalanceCheckDt}
            purchaseTs={purchaseTs}
            onPress={() => goToGiftCardDetail({ providerCardId, brandName, cardBalance, statusInd, cardProvider })}
            brandLogo={brandLogo}
            faceplateUrl={faceplateUrl}
          />
        </SwipeItem>
      );
    },
    [goToGiftCardDetail, onTapHandle, platform.OS]
  );

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.toggleButtonContainer}>
        <View style={styles.toggleButton}>
          <TouchableOpacity {...getTestIdProps('see-actives')} onPress={() => setIsGiftCardsActive(true)}>
            <Text style={[styles.toggleButtonText, isGiftCardsActive && styles.toggleButtonTextActive]}>Your Gift Cards</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleButtonSeparator} />
        <View style={styles.toggleButton}>
          <TouchableOpacity {...getTestIdProps('see-archives')} onPress={() => setIsGiftCardsActive(false)}>
            <Text style={[styles.toggleButtonText, !isGiftCardsActive && styles.toggleButtonTextActive]}>Archived Gift Cards</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!giftCardsFiltered.length ? (
        <View style={styles.fallback} {...getTestIdProps('fallback')}>
          <Icon
            name={ICON.EMPTY_STATE}
            size={FONT_SIZE.XL}
            color={isGiftCardsActive ? COLOR.PRIMARY_BLUE : COLOR.DARK_GRAY}
            backgroundStyle={[styles.iconBackground, { backgroundColor: isGiftCardsActive ? COLOR.SOFT_PRIMARY_BLUE : COLOR.MEDIUM_GRAY }]}
            innerBackgroundStyle={styles.iconInnerBackground}
          />
          <Text style={styles.titleFallback}>
            {isGiftCardsActive
              ? "Uh-oh! It looks like you don't have any active Gift Cards yet."
              : "Uh-oh! It looks like you don't have any archived Gift Cards yet."}
          </Text>
        </View>
      ) : (
        <FlatList data={giftCardsFiltered} keyExtractor={keyExtractor} renderItem={renderItem} showsVerticalScrollIndicator={false} />
      )}
      <View style={styles.footerContainer}>
        <Button
          innerContainerStyle={styles.innerButton}
          textStyle={styles.buttonText}
          onPress={() => navigation.navigate(ROUTES.MAIN_TAB.REWARDS)}
          {...getTestIdProps('buy-gift-card')}
        >
          Buy Gift Card <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.SMALLER} color={COLOR.WHITE} />
        </Button>
      </View>
      <StatusConfirmationModal
        name={giftCardName}
        isVisible={isVisibleModal}
        isLoading={isLoading}
        status={giftCardStatus.status}
        onDismiss={() => setIsVisibleModal(false)}
        onSuccess={onSuccessHandle}
      />
    </View>
  );
};

export default memo(YourGiftCards);
