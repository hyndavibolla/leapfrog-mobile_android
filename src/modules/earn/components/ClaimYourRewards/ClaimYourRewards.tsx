import React, { memo, useMemo, useContext, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Title, TitleType } from '_components/Title';
import { Carrousel } from '_components/Carrousel';
import { LargeContentCard, Props as LargeContentCardProps, Theme } from '_commons/components/molecules/LargeContentCard';
import { ButtonCTA } from '_modules/earn/components/ButtonCTA';

import { ForterActionType, ICON, PageNames, ROUTES, TealiumEventType, UxObject } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';
import { useEventTracker } from '_state_mgmt/core/hooks';

export interface Props {
  title?: string;
}

export const ClaimYourRewards = ({ title }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-claim-your-rewards');
  const navigation = useNavigation();
  const { deps } = useContext(GlobalContext);
  const { trackUserEvent } = useEventTracker();

  const handleOnPress = useCallback(
    ({ card_id, card_url }: { card_id: string; card_url: string }) => {
      trackUserEvent(
        TealiumEventType.CLAIM_REWARDS_CARDS,
        {
          page_name: PageNames.MAIN.EARN,
          event_type: TealiumEventType.CARD_TAPPED,
          event_name: TealiumEventType.CLAIM_REWARDS_CARDS,
          event_detail: JSON.stringify({ card_id, card_url }),
          uxObject: UxObject.TILE
        },
        ForterActionType.TAP
      );
      if (card_url === ROUTES.MAIN_TAB.REWARDS) {
        navigation.navigate(card_url);
      } else {
        deps.nativeHelperService.linking.openURL(card_url);
      }
    },
    [deps.nativeHelperService.linking, navigation, trackUserEvent]
  );

  const rewardCardsData: LargeContentCardProps[] = useMemo(
    () => [
      {
        title: 'Get your Gift Cards!',
        description: 'Discover all your favorite brands',
        onPress: () => handleOnPress({ card_id: 'getGiftCards', card_url: ROUTES.MAIN_TAB.REWARDS }),
        backgroundImage: require('_assets/shared/claimGetGiftCards.png'),
        children: <ButtonCTA icon={ICON.REWARDS_GIFT_CARDS} title="Get Gift Cards" />
      },
      {
        title: 'Redeem on SYW',
        description: 'Redeem or earn points on Shop Your Way!',
        onPress: () =>
          handleOnPress({
            card_id: 'sywcom',
            card_url: 'https://www.shopyourway.com/redeempoints'
          }),
        backgroundImage: require('_assets/shared/claimSYW.png'),
        children: <ButtonCTA icon={ICON.ARROW_RIGHT} title="Let's go!" />
      },
      {
        title: 'Redeem at Sears',
        description: 'Redeem on Marketplace partner products!',
        onPress: () =>
          handleOnPress({
            card_id: 'sears',
            card_url: 'https://m.sears.com/'
          }),
        backgroundImage: require('_assets/shared/claimSears.png'),
        children: <ButtonCTA icon={ICON.ARROW_RIGHT} theme={Theme.DARK} title="Let's go!" />,
        theme: Theme.DARK
      },
      {
        title: 'Redeem at Kmart',
        description: 'Redeem or earn points at Kmart!',
        onPress: () =>
          handleOnPress({
            card_id: 'kmart',
            card_url: 'https://m.kmart.com/'
          }),
        backgroundImage: require('_assets/shared/claimKmart.png'),
        children: <ButtonCTA icon={ICON.ARROW_RIGHT} theme={Theme.DARK} title="Let's go!" />,
        theme: Theme.DARK
      }
    ],
    [handleOnPress]
  );

  const renderItem = useCallback(({ item }: { item: LargeContentCardProps }) => <LargeContentCard {...item} />, []);

  return (
    <View style={styles.sectionMain} {...getTestIdProps('container')}>
      <View style={styles.streakSectionHeader} {...getTestIdProps('header')}>
        <Title type={TitleType.SECTION} numberOfLines={1} ellipsizeMode="tail">
          {title ?? 'Claim your Rewards!'}
        </Title>
      </View>
      <Carrousel itemWidth={335} separatorWidth={12}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.claimRewardsListContainer}
          data={rewardCardsData}
          keyExtractor={({ title: elementTitle }) => elementTitle}
          renderItem={renderItem}
          horizontal
        />
      </Carrousel>
    </View>
  );
};

export default memo(ClaimYourRewards);
