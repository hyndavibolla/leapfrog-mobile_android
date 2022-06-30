import React, { memo, useCallback, useContext } from 'react';
import { StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { Title, TitleType } from '_components/Title';
import { ActiveMissionsOffersCard } from '_components/ActiveMissionsOffersCard';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { IMission, MissionListType } from '_models/mission';
import { isAvailableStreakIndicator } from '_utils/isAvailableStreakIndicator';

import { ROUTES } from '_constants/routes';

import { styles } from './styles';

export interface Props {
  offers: IMission[];
  title?: string;
  seeAllButton?: boolean;
  name?: string;
}

const maximumNumberToShowOnLargeDevices: number = 9;

function ActiveMissionsOffers({ offers, name, ...props }: Props) {
  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('active-missions-offers');
  const {
    state: {
      mission: { missionListTitleMap }
    }
  } = useContext(GlobalContext);

  const title: string = props?.title ?? missionListTitleMap[KnownMissionSearchKey.DYNAMIC_LIST_2];

  const handlePressSeeAll = useCallback(() => {
    navigate(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DYNAMIC_LIST_2,
      title,
      listTitle: title,
      sectionName: name
    });
  }, [navigate, title, name]);

  const getOfferCard = (mission: IMission, style: StyleProp<ViewStyle>) => {
    if (!mission) return null;
    return (
      <View style={[styles.activeMissionContainer, style]}>
        <ActiveMissionsOffersCard mission={mission} streakIndicator={isAvailableStreakIndicator(mission)} style={styles.activeMission} />
      </View>
    );
  };
  const getGridRows = () => {
    const result = [];
    const firstOffers = offers.slice(0, maximumNumberToShowOnLargeDevices);
    for (let index = 0; index < firstOffers.length; index += 3) {
      const [middleOffer, lastOffer] = [firstOffers[index + 1], firstOffers[index + 2]];
      result.push(
        <View key={`row-${index}`} style={styles.gridRow}>
          {getOfferCard(firstOffers[index], { paddingRight: middleOffer ? 8 : 0 })}
          {getOfferCard(middleOffer, { paddingLeft: 8, paddingRight: lastOffer ? 8 : 0 })}
          {getOfferCard(lastOffer, { paddingLeft: 8 })}
        </View>
      );
    }
    return result;
  };

  return (
    <>
      <View style={styles.containerTitle}>
        <Title numberOfLines={1} ellipsizeMode="tail" type={TitleType.SECTION}>
          {title}
        </Title>
        {props?.seeAllButton ? (
          <TouchableHighlight underlayColor="transparent" {...getTestIdProps('see-all')} onPress={handlePressSeeAll}>
            <Title style={styles.link} type={TitleType.SECTION}>
              See all
            </Title>
          </TouchableHighlight>
        ) : null}
      </View>
      <View style={styles.rowContainer} {...getTestIdProps('grid')}>
        {getGridRows()}
      </View>
    </>
  );
}

export default memo(ActiveMissionsOffers);
