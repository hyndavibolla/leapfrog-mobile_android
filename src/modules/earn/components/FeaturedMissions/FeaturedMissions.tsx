import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Title, TitleType } from '_components/Title';
import ErrorBoundary from '_components/ErrorBoundary';
import { LargeStreakCard } from '_components/LargeStreakCard/LargeStreakCard';
import { SectionError } from '../SectionError';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useGetStreakList } from '_state_mgmt/streak/hooks';
import { ROUTES } from '_constants';

import { styles } from './styles';

export interface Props {
  focusKey: string;
  isLoadingCallback: (isLoading: boolean) => void;
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

export const FeaturedMissions = ({ focusKey, isLoadingCallback, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-featured-missions');
  const navigation = useNavigation();
  const [onGetStreakList, isLoadingStreakList = true, streakListError, streakList = []] = useGetStreakList();

  useEffect(() => {
    onGetStreakList(true);
  }, [focusKey, onGetStreakList]);

  useEffect(() => {
    isLoadingCallback(isLoadingStreakList);
  }, [isLoadingStreakList, isLoadingCallback]);

  return streakListError ? (
    <SectionError />
  ) : !streakList.length ? null : (
    <View style={styles.sectionMain} {...getTestIdProps('container')}>
      <ErrorBoundary>
        <View style={styles.streakSectionHeader} {...getTestIdProps('streak-header')}>
          <Title type={TitleType.SECTION} numberOfLines={1} ellipsizeMode="tail">
            {props?.title ?? 'Featured Missions'}
          </Title>
        </View>
        {streakList.slice(0, 1).map(streak => (
          <View key={streak.rewardOfferCode}>
            <LargeStreakCard streak={streak} onPress={() => navigation.navigate(ROUTES.MAIN_TAB.STREAK)} />
          </View>
        ))}
      </ErrorBoundary>
    </View>
  );
};

export default memo(FeaturedMissions);
