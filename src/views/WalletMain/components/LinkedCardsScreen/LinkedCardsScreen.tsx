import React, { memo, useContext, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Modal, ModalSize } from '_components/Modal';
import { Title, TitleType } from '_components/Title';
import { Icon } from '_commons/components/atoms/Icon';
import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { ILinkedCard } from '_models/cardLink';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import MoreInformationIcon from '_assets/shared/moreInfo.svg';
import { LinkedCardListItem } from '_views/WalletMain/components/LinkedCardListItem';
import { LinkedCardList } from '_views/WalletMain/components/LinkedCardList';
import { BannerApplyForCardWithDescription } from '_views/WalletMain/components/BannerApplyForCardWithDescription';

import { styles } from './styles';

export interface Props {
  linkedCardsList: ILinkedCard[];
  linkedCardsListError: boolean;
}

export const LinkedCardsScreen = ({ linkedCardsList, linkedCardsListError }: Props) => {
  const [shouldShowCardlinkModal, setShouldShowCardlinkModal] = useState(false);

  const { getTestIdProps } = useTestingHelper('linked-cards-screen');

  const {
    state: {
      game: {
        current: {
          memberships: { userHasSywCard, sywCardLastFour }
        }
      }
    }
  } = useContext(GlobalContext);
  const linkedSYWCard = useMemo(() => linkedCardsList?.find(linkedCard => linkedCard.isSywCard), [linkedCardsList]);

  return (
    <>
      <View {...getTestIdProps('container')} style={styles.container}>
        {!userHasSywCard && <BannerApplyForCardWithDescription />}
        {userHasSywCard && linkedCardsList && !linkedSYWCard ? <LinkedCardListItem cardLastFour={sywCardLastFour} isSywCard={true} /> : null}
        <View style={styles.titleContainer}>
          <Title type={TitleType.SECTION} style={styles.title}>
            My Cardlink Cards
          </Title>
          <Pressable {...getTestIdProps('more-information')} onPress={() => setShouldShowCardlinkModal(true)}>
            <MoreInformationIcon width={24} height={24} />
          </Pressable>
        </View>
        <View style={styles.subtitleContainer}>
          <Icon name={ICON.OFFER_CIRCLE} color={COLOR.PURPLE} size={FONT_SIZE.SMALLER} />
          <Text style={styles.subtitle}>All linked cards are available for Local Offers at participating restaurants near you.</Text>
        </View>
        <LinkedCardList linkedCardsList={linkedCardsList} linkedCardsListError={linkedCardsListError} />
      </View>
      <Modal
        size={ModalSize.EXTRA_LARGE}
        visible={shouldShowCardlinkModal}
        showCloseButton
        onClose={() => setShouldShowCardlinkModal(false)}
        style={styles.modal}
        closeButtonStyle={styles.closeButtonModal}
      >
        <ScrollView showsVerticalScrollIndicator={false} {...getTestIdProps('modal-cardlink')}>
          <Text style={styles.cardLinkMainTitle}>How does Cardlink work?</Text>
          <View>
            <Icon name={ICON.CARD} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.SMALLER} />
            <Text style={styles.cardLinkTitle}>How do I link my card to Cardlink?</Text>
            <Text style={styles.cardLinkSubtitle}>
              Make sure you’re on the Wallet tab. Then tap ‘Add my card’ in My Cardlink Cards. Provide your credit card number and zip code. That’s it. If you
              have a Shop Your Way Mastercard®, your card will be automatically linked to Cardlink. If you don’t see your Shop Your Way Mastercard linked — and
              you want to start earning points right away — you can enter it manually.
            </Text>
            <Icon name={ICON.CARD} color={COLOR.DARK_GRAY} size={FONT_SIZE.SMALLER} />
            <Text style={styles.cardLinkTitle}>How do I remove a card from Cardlink?</Text>
            <Text style={styles.cardLinkSubtitle}>
              You can remove a card from Cardlink in your Shop Your Way Wallet. Select the card you want to remove and tap ‘Unlink from Cardlink.’
            </Text>
            <Icon name={ICON.OFFER_CIRCLE} color={COLOR.PURPLE} size={FONT_SIZE.SMALLER} />
            <Text style={styles.cardLinkTitle}>How do I get Local Offers?</Text>
            <Text style={[styles.cardLinkSubtitle, styles.cardLinkSubtitleLastChild]}>
              Make sure you’re on the Earn tab. Then look for offers at restaurants near you. When you find one you like, simply tap the Activate button. Also
              from the Earn tab, you can use the interactive map to find offers near you.{'\n \n'}Note: You must link a credit card to start activating offers.
              Once an offer is activated, it remains active for 45 days. After that, if you want to keep earning with that restaurant, you’ll need to
              re-activate the offer.
            </Text>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};
export default memo(LinkedCardsScreen);
