import React, { memo, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ActivityList } from '_components/ActivityList';
import { Button } from '_components/Button';
import { Modal, ModalSize, ModalSubtitle, ModalTitle } from '_components/Modal';

import { useCardEnrollment, useGetLinkedCardsList } from '_state_mgmt/cardLink/hooks';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { useGetActivity } from '_state_mgmt/game/hooks';
import { useDebounce } from '_utils/useDebounce';
import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { sortByDate } from '_utils/sortByDate';
import { getPageNameWithParams } from '_utils/trackingUtils';
import { createUUID } from '_utils/create-uuid';

import { ActivityModel } from '_models';
import { cardName, EnrollmentEventType, ILinkedCard } from '_models/cardLink';
import { DateLike } from '_models/general';

import { CONTAINER_STYLE, EventDetail, ForterActionType, PageNames, PageType, ROUTES, TealiumEventType, UxObject } from '_constants';

import DeleteCircle from '_assets/shared/delete-circle.svg';
import PathIcon from '_assets/shared/path.svg';
import VisaCardIcon from '_assets/in-store-offer/visaCard.svg';
import MasterCardIcon from '_assets/in-store-offer/masterCard.svg';
import AmexCardIcon from '_assets/in-store-offer/amexCard.svg';
import DiscoverCardIcon from '_assets/in-store-offer/discoverCard.svg';

import { styles } from './styles';

export interface Props {
  route: {
    params: {
      cardId: string;
      isSywCard: boolean;
      isLinkedToCardlink?: boolean;
      cardLastFour: string;
    };
  };
}

const cardTypeIcon = {
  VISA: VisaCardIcon,
  MSTR: MasterCardIcon,
  DISC: DiscoverCardIcon,
  AMEX: AmexCardIcon
};

function WalletDetail({
  route: {
    params: { cardId, isSywCard, isLinkedToCardlink, cardLastFour }
  }
}: Props) {
  const [isLinkedToCardlinkVisible, setIsLinkedToCardlinkVisible] = useState(isLinkedToCardlink);
  const [isModalUnlinkCardVisible, setIsModalUnlinkCardVisible] = useState(false);
  const [activityList, setActivityList] = useState<(ActivityModel.IActivity & { uuid: string })[]>([]);
  const [prevLastTimestamp, setPrevLastTimestamp] = useState<DateLike>(null);
  const [isTryingToRemove, setIsTryingToRemove] = useState(false);

  const { trackUserEvent } = useEventTracker();
  const { navigate, goBack } = useNavigation();
  const { getTestIdProps } = useTestingHelper('wallet-detail');
  const [onLoadLinkedCardsList] = useGetLinkedCardsList();
  const [changeCardEnrollment] = useCardEnrollment();
  const [fetchActivityList, isLoadingActivities = true, activitiesError, fetchedList = []] = useGetActivity();
  const debouncedIsLoadingActivities = useDebounce(isLoadingActivities, 50);

  const {
    state: {
      cardLink: { linkedCardsList }
    }
  } = useContext(GlobalContext);

  useEffect(() => {
    const newBatch = fetchedList
      .filter(activity => activity.offers?.length)
      .sort(sortByDate('timestamp'))
      .reverse()
      .map(a => ({ ...a, uuid: `${Date.now()}-${createUUID()}` }));
    if (newBatch.length) setActivityList(prev => [...prev, ...newBatch]);
  }, [fetchedList]);

  const linkedCard = useMemo<ILinkedCard>(() => {
    return linkedCardsList.find(card => card.cardId === cardId);
  }, [linkedCardsList, cardId]);

  useEffect(() => {
    fetchActivityList(Date.now(), linkedCard?.cardId).then(activities => {
      const lastTimestamp = activities[0]?.timestamp;
      setPrevLastTimestamp(lastTimestamp);
    });
  }, [fetchActivityList, linkedCard?.cardId]);

  const isListEmpty = !debouncedIsLoadingActivities && !isLoadingActivities && !activityList.length;

  const trackUnenrollmentEvent = useCallback(
    () =>
      trackUserEvent(
        TealiumEventType.CARD,
        {
          page_name: getPageNameWithParams(PageNames.WALLET.WALLET_DETAIL, [linkedCard?.cardLastFour]),
          page_type: PageType.INFO,
          section: 'wallet',
          event_type: TealiumEventType.CARD,
          event_name: TealiumEventType.CARDLINK,
          event_detail: EventDetail.UNENROLL,
          uxObject: UxObject.BUTTON
        },
        ForterActionType.TAP
      ),
    [trackUserEvent, linkedCard?.cardLastFour]
  );

  const handleCardUnenrollment = useCallback(
    async (isACardDeleted?: boolean) => {
      await changeCardEnrollment({
        eventType: EnrollmentEventType.UNENROLL,
        programDetail: linkedCard
      });
      await onLoadLinkedCardsList();
      trackUnenrollmentEvent();
      setIsLinkedToCardlinkVisible(false);
      setIsModalUnlinkCardVisible(false);
      setIsTryingToRemove(false);
      if (isACardDeleted) goBack();
    },
    [changeCardEnrollment, goBack, linkedCard, onLoadLinkedCardsList, trackUnenrollmentEvent]
  );

  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={CONTAINER_STYLE.shadow}>
          <View style={styles.cardBanner}>
            <View style={styles.imageBackgroundContainer}>
              <ImageBackground style={styles.imageBackground} source={require('_assets/shared/backgroundFullPatternAsset.png')}>
                <View style={styles.creditCardAndText}>
                  {isSywCard ? (
                    <Image source={require('_assets/credit-card/creditCard.png')} style={styles.image as any} />
                  ) : linkedCard?.cardType ? (
                    cardTypeIcon[linkedCard?.cardType]()
                  ) : null}
                  <Text style={styles.cardTitle} {...getTestIdProps('card-text')}>
                    {isSywCard ? 'Shop Your Way Mastercard®' : cardName[linkedCard?.cardType]} {'\n'} ****{' '}
                    {linkedCard?.cardLastFour ? linkedCard.cardLastFour : cardLastFour}
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.buttonsContainer}>
              {isSywCard ? (
                <>
                  {isLinkedToCardlinkVisible ? (
                    <TouchableOpacity {...getTestIdProps('unlink-card')} onPress={() => setIsModalUnlinkCardVisible(true)}>
                      <Text style={styles.dangerButtonText}>Unlink from Cardlink</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity {...getTestIdProps('link-card')} onPress={() => navigate(ROUTES.IN_STORE_OFFERS.CARD_LINK)}>
                      <Text style={styles.primaryButtonText}>Link to Cardlink</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity {...getTestIdProps('manage-card')} onPress={() => navigate(ROUTES.MANAGE_SYW_CARD)}>
                    <Text style={styles.primaryButtonText}>Manage Card</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity {...getTestIdProps('remove-card')} onPress={() => setIsTryingToRemove(true)}>
                  <Text style={styles.dangerButtonText}>Remove Card</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
        </View>
      </>
    ),
    [getTestIdProps, isLinkedToCardlinkVisible, linkedCard, isSywCard, cardLastFour, navigate]
  );

  const onLoadMore = useCallback(async () => {
    /* istanbul ignore next line - Can't be tested as container won't render until first search concludes */
    if (!prevLastTimestamp) return;
    const activities = await fetchActivityList(prevLastTimestamp, linkedCard?.cardId);
    const lastTimestamp = activities[0]?.timestamp;
    setPrevLastTimestamp(lastTimestamp);
  }, [fetchActivityList, linkedCard?.cardId, prevLastTimestamp]);

  return (
    <View style={styles.container}>
      <ActivityList
        activityList={activityList}
        activitiesError={activitiesError}
        onLoadMore={onLoadMore}
        isListEmpty={isListEmpty}
        isLoadingActivities={isLoadingActivities}
        ListHeaderComponent={ListHeaderComponent}
      />

      <Modal size={ModalSize.DYNAMIC} visible={!!isModalUnlinkCardVisible} onPressOutside={() => setIsModalUnlinkCardVisible(false)}>
        <View style={styles.modalUnlinkContainer} {...getTestIdProps('syw-unlink-modal-container')}>
          <View style={styles.iconContainer}>
            <PathIcon width={30} height={30} />
          </View>
          <ModalTitle>Unlinking your card</ModalTitle>

          <ModalSubtitle>
            {'\n \n'} Are you sure you want to unlink Shop Your Way Mastercard® ending in {linkedCard?.cardLastFour}? {'\n \n'} You won't get extra points for
            eating at local restaurants. But your Shop Your Way Mastercard® will remain available in your Shop Your Way Wallet.{'\n \n'}
          </ModalSubtitle>

          <ModalTitle>Do you want to remove it now?</ModalTitle>

          <View style={styles.selectionBtnContainer}>
            <Button innerContainerStyle={styles.button} onPress={() => handleCardUnenrollment()} {...getTestIdProps('unenrollment-card-button')}>
              <Text style={styles.buttonText}>Yes</Text>
            </Button>
            <Text style={styles.textOutlineButton} onPress={() => setIsModalUnlinkCardVisible(false)} {...getTestIdProps('cancel-button')}>
              Cancel
            </Text>
          </View>
        </View>
      </Modal>

      <Modal size={ModalSize.DYNAMIC} visible={isTryingToRemove} onClose={() => setIsTryingToRemove(false)}>
        <View style={styles.trashIcon} {...getTestIdProps('card-unlink-modal-container')}>
          <DeleteCircle width={60} height={60} />
        </View>
        <ModalTitle>Deleting a linked card</ModalTitle>
        <ModalSubtitle style={styles.modalDescription}>
          {'\n \n'} Are you sure you want to delete your {cardName[linkedCard?.cardType]} ending in {linkedCard?.cardLastFour} {'\n \n'} You won't continue to
          get extra points for eating at local restaurants and your card will be removed from your Shop Your Way Wallet.
        </ModalSubtitle>
        <ModalTitle>Do you want to remove it now?</ModalTitle>
        <View style={styles.selectionBtnContainer}>
          <Button innerContainerStyle={styles.button} onPress={() => handleCardUnenrollment(true)} {...getTestIdProps('remove-card-button')}>
            <Text style={styles.buttonText}>Yes</Text>
          </Button>
          <Text style={styles.textOutlineButton} onPress={() => setIsTryingToRemove(false)} {...getTestIdProps('remove-cancel-button')}>
            Cancel
          </Text>
        </View>
      </Modal>
    </View>
  );
}

export default memo(WalletDetail);
