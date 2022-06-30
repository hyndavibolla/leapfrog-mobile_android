import React, { memo, useMemo, useCallback, useContext, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import GiftCard from '../GiftCard/GiftCard';
import { EmptyState } from './components/EmptyState';
import { Title, TitleType } from '_components/Title';
import { Button } from '_components/Button';
import { SwipeItem } from '_commons/components/molecules/SwipeItem';
import { StatusConfirmationModal } from '_modules/wallet/components/StatusConfirmationModal';
import { useGiftCardStatus } from '_state_mgmt/giftCard';
import { IGiftCard, statusType, IGiftCardStatus } from '_models/giftCard';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Flagged, shouldShowFeature } from '_components/Flagged';
import { FeatureFlag } from '_models/general';
import { ROUTES, ICON, TealiumEventType, UxObject, ForterActionType, PageNames, FONT_SIZE, COLOR } from '_constants';

import GiftCardFallback from '_assets/shared/giftCardFallback.svg';

import { styles } from './styles';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { Icon } from '_commons/components/atoms/Icon';

export interface Props {
  giftCardsList: IGiftCard[];
  giftCardsListError?: boolean;
}

export const GiftCardsScreen = ({ giftCardsList, giftCardsListError = false }: Props) => {
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [giftCardName, setGiftCardName] = useState<string>('');
  const [giftCardStatus, setGiftCardStatus] = useState<IGiftCardStatus>({ id: '', status: undefined, cardProvider: '' });
  const { getTestIdProps } = useTestingHelper('gift-cards-screen');
  const {
    deps: {
      nativeHelperService: { platform }
    }
  } = useContext(GlobalContext);
  const { navigate } = useNavigation();
  const [setCardStatus, isLoading] = useGiftCardStatus();
  const { trackUserEvent } = useEventTracker();

  const onTapHandle = useCallback((id: string, cardProvider: string, status: statusType, name: string) => {
    setGiftCardStatus({ id, status, cardProvider });
    setGiftCardName(name);
    setIsVisibleModal(true);
  }, []);

  const onSuccessHandle = useCallback(async () => {
    await setCardStatus(giftCardStatus.id, statusType.HIDDEN, giftCardStatus.cardProvider);
    trackUserEvent(
      TealiumEventType.WALLET,
      {
        page_name: PageNames.WALLET.WALLET_YOUR_GIFT_CARDS_ACTIVE,
        event_name: TealiumEventType.WALLET,
        uxObject: UxObject.BUTTON,
        event_type: TealiumEventType.GIFT_CARD_ARCHIVE
      },
      ForterActionType.TAP
    );

    setIsVisibleModal(false);
  }, [giftCardStatus, setCardStatus, trackUserEvent]);

  const giftCardLimit = useMemo(
    () =>
      giftCardsList?.length && shouldShowFeature(FeatureFlag.WALLET_YOUR_GC)
        ? giftCardsList.filter(giftCard => giftCard.statusInd === statusType.ACTIVE).slice(0, 5)
        : giftCardsList,
    [giftCardsList]
  );

  const hasActiveGiftCards = useMemo(() => giftCardsList.filter(giftCard => giftCard.statusInd === statusType.ACTIVE).length > 0, [giftCardsList]);
  const hasArchivedGiftCards = useMemo(() => giftCardsList.filter(giftCard => giftCard.statusInd === statusType.HIDDEN).length > 0, [giftCardsList]);

  const showArchivedState = useMemo(
    () => giftCardsList?.length && shouldShowFeature(FeatureFlag.WALLET_YOUR_GC) && !hasActiveGiftCards && hasArchivedGiftCards,
    [giftCardsList, hasActiveGiftCards, hasArchivedGiftCards]
  );

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
      navigate(ROUTES.GIFT_CARD_LIST_DETAIL, {
        giftCardId: providerCardId,
        title: brandName,
        cardBalance,
        statusInd,
        cardProvider
      }),
    [navigate]
  );

  const getGiftCardsScreenContent = () => {
    if (giftCardsListError) {
      return (
        <View style={styles.fallBack}>
          <GiftCardFallback />
          <Text style={styles.titleFallback}>Unfortunately we can’t load your Gift Cards right now</Text>
          <Text style={styles.descriptionFallback}>We're working to find a solution.In the meantime, please explore the Rewards catalog.</Text>
          <Pressable {...getTestIdProps('explore-gift-card')} onPress={() => navigate(ROUTES.MAIN_TAB.REWARDS)}>
            <Text style={styles.actionFallback}>Explore Gift Cards</Text>
          </Pressable>
        </View>
      );
    }

    if (showArchivedState) {
      return (
        <EmptyState
          title="Uh-oh! It looks like you don't have any active Gift Cards."
          description="To see your archived Gift Cards, please tap the 'See All' button."
        />
      );
    }

    if (!giftCardsList?.length) {
      return <EmptyState title="Uh-oh! It looks like you don't have any Gift Cards." />;
    }

    return (
      <>
        {giftCardLimit.map(
          ({
            providerCardId,
            providerBrandId,
            cardValue,
            cardBalance,
            cardBalanceCheckDt,
            purchaseTs,
            statusInd,
            cardProvider,
            brandDetails: { brandName, brandLogo, faceplateUrl }
          }) => {
            if (shouldShowFeature(FeatureFlag.WALLET_YOUR_GC) && platform.OS !== 'android') {
              return (
                <SwipeItem
                  key={`${providerCardId}-${providerBrandId}`}
                  onTapRight={() => onTapHandle(providerCardId, cardProvider, statusInd, brandName)}
                  iconLeft={ICON.FOLDER_ARROW_DOWN}
                  textLeft={'Archive'}
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
            }
            return (
              <GiftCard
                key={`${providerCardId}-${providerBrandId}`}
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
        )}
        <View style={styles.footerContainer}>
          <Button
            style={styles.emptyStateBtn}
            innerContainerStyle={styles.innerButton}
            textStyle={styles.buttonText}
            onPress={() => navigate(ROUTES.MAIN_TAB.REWARDS)}
            {...getTestIdProps('buy-gift-card')}
          >
            Buy Gift Cards <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.SMALLER} color={COLOR.WHITE} />
          </Button>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.titleContainer}>
        <Title type={TitleType.SECTION} style={styles.title}>
          My Gift Cards
        </Title>
        {giftCardsListError || !giftCardsList!.length ? null : (
          <Flagged feature={FeatureFlag.WALLET_YOUR_GC}>
            <TouchableOpacity
              {...getTestIdProps('see-all')}
              onPress={() => navigate(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: !showArchivedState })}
            >
              <Title type={TitleType.SECTION} style={[styles.title, styles.link]}>
                See all
              </Title>
            </TouchableOpacity>
          </Flagged>
        )}
      </View>
      {getGiftCardsScreenContent()}
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
export default memo(GiftCardsScreen);
