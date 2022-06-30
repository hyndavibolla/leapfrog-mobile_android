import React, { memo, useRef, useMemo, useCallback, useEffect, useContext } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Title, TitleType } from '_components/Title';
import { NewOnMaxCard } from '_components/NewOnMaxCard';
import { Carrousel } from '_components/Carrousel';

import { useTestingHelper } from '_utils/useTestingHelper';
import { routesContain } from '_utils/routeUtils';
import { TealiumEventType, PageNames, PageType, UxObject, ForterActionType, ENV } from '_constants';

import { ISailthruMessage } from '_models/general';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useNewOnMaxMessages } from '_state_mgmt/messages/hooks';
import { useEventTracker } from '_state_mgmt/core/hooks';

import WavingHandIcon from '_assets/shared/wavingHand.svg';

import { styles } from './styles';

export interface Props {
  focusKey: string;
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

const NewOnMax = ({ focusKey, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-new-on-max');
  const navigation = useNavigation();
  const { deps } = useContext(GlobalContext);
  const newOnMaxRef = useRef<FlatList>();
  const { trackUserEvent } = useEventTracker();
  const [newOnMaxMessages, onGetNewOnMaxMessages, onReadNewOnMaxMessage, showNewOnMaxOnboard, onReadNewOnMaxOnboard] = useNewOnMaxMessages();
  const { width } = useWindowDimensions();

  useEffect(() => {
    onGetNewOnMaxMessages();
  }, [focusKey, onGetNewOnMaxMessages]);

  const newOnMaxKeyExtractor = useCallback((item: ISailthruMessage) => item.id, []);

  const onNewOnMaxActionPress = useCallback(
    (item: ISailthruMessage) => {
      const { ctaRoute } = item.custom;
      if (routesContain(ctaRoute)) {
        navigation.navigate(ctaRoute);
        onReadNewOnMaxMessage(item);
        trackUserEvent(
          TealiumEventType.NEW_ON_MAX_CARD_TAP,
          {
            page_name: PageNames.MAIN.EARN,
            page_type: PageType.TOP,
            address: `${ENV.SCHEME}${ctaRoute}`,
            event_type: PageType.CARD_CLICK,
            uxObject: UxObject.CARD,
            event_detail: item.title
          },
          ForterActionType.TAP
        );
      } else {
        deps.logger.error('New On Max message does not have a valid route', { ctaRoute, item });
        trackUserEvent(
          TealiumEventType.ERROR,
          {
            page_name: PageNames.MAIN.EARN,
            page_type: PageType.TOP,
            event_type: PageType.CARD_CLICK,
            uxObject: UxObject.CARD,
            event_detail: item.title,
            error: 'New On Max message does not have a valid route'
          },
          ForterActionType.TAP
        );
      }
    },
    [navigation, onReadNewOnMaxMessage, trackUserEvent, deps]
  );

  const onNewOnMaxClosePress = useCallback(
    (item: ISailthruMessage) => {
      onReadNewOnMaxMessage(item);
      trackUserEvent(
        TealiumEventType.NEW_ON_MAX_CARD_TAP,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.TOP,
          address: `${ENV.SCHEME}${item.custom.ctaRoute}`,
          event_type: PageType.CARD_CLOSE,
          uxObject: UxObject.CARD,
          event_detail: item.title
        },
        ForterActionType.TAP
      );
    },
    [onReadNewOnMaxMessage, trackUserEvent]
  );

  const renderNewOnMaxItem = useCallback(
    ({ item }: { item: ISailthruMessage }) => (
      <NewOnMaxCard
        key={item.id}
        title={item.title}
        description={item.text}
        Icon={item?.cardImageUrl}
        actionText={item.custom.ctaText}
        onActionPress={() => onNewOnMaxActionPress(item)}
        onClosePress={() => onNewOnMaxClosePress(item)}
      />
    ),
    [onNewOnMaxActionPress, onNewOnMaxClosePress]
  );

  const renderNewOnMaxOnboard = useMemo(
    () =>
      !showNewOnMaxOnboard ? null : (
        <NewOnMaxCard
          title="Take a look at what’s new!"
          description="Earn points for everything you do and spend those as you wish!"
          Icon={WavingHandIcon}
          onClosePress={onReadNewOnMaxOnboard}
        />
      ),
    [showNewOnMaxOnboard, onReadNewOnMaxOnboard]
  );

  return newOnMaxMessages?.length ? (
    <>
      <View style={styles.sectionMain} {...getTestIdProps('container')}>
        <Title type={TitleType.HEADER} style={styles.mainTitleContainer}>
          {props?.title ?? 'New on MAX'}
        </Title>
        <Carrousel itemWidth={width * 0.9} separatorWidth={16}>
          <FlatList
            ref={newOnMaxRef}
            style={styles.list}
            data={newOnMaxMessages}
            contentContainerStyle={styles.newOnMaxCarrousel}
            keyExtractor={newOnMaxKeyExtractor}
            renderItem={renderNewOnMaxItem}
            horizontal={true}
            removeClippedSubviews={true}
            initialNumToRender={4}
            updateCellsBatchingPeriod={150}
            maxToRenderPerBatch={6}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListHeaderComponent={renderNewOnMaxOnboard}
            ListFooterComponentStyle={styles.listContainerEnd}
            {...getTestIdProps('horizontal-scroll')}
          />
        </Carrousel>
      </View>
    </>
  ) : null;
};

const ItemSeparatorComponent = /* istanbul ignore next */ () => <View style={styles.itemSeparator} />;

export default memo(NewOnMax);
