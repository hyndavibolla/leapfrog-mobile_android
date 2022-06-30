import React, { memo, useContext, useCallback, useEffect, useRef, ReactElement, useMemo } from 'react';
import { Animated, Text, View, Image, ImageStyle, FlatListProps } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { noop } from '_utils/noop';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { initialState as userInitialState } from '_state_mgmt/user/state';

import RocketEmoji from '_assets/shared/rocketEmoji.svg';

import { styles } from './styles';
import { ENV } from '_constants/env';

export interface Props {
  fromSkipTutorial: boolean;
}

export const TutorialCongratsBanner = ({ fromSkipTutorial }: Props) => {
  const { getTestIdProps } = useTestingHelper('tutorial-congrats-banner');
  const {
    state: {
      user: {
        currentUser: { firstName }
      }
    }
  } = useContext(GlobalContext);

  const tutorialCongratsBannerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const elements = useMemo(
    () => [
      {
        text: `Here we go${firstName && firstName !== userInitialState.currentUser.firstName ? ', ' + firstName : ''}!`,
        icon: <RocketEmoji />
      },
      {
        text: 'Check it any time on your profile',
        icon: <Image style={styles.profileIcon as ImageStyle} source={require('_assets/shared/avatarFallbackInverted.png')} />
      }
    ],
    [firstName]
  );

  const bannerData = useMemo(() => (fromSkipTutorial ? [elements[1]] : elements), [fromSkipTutorial, elements]);

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      /** @todo istanbul ignore next was added on [LEAP-3849] - due to failing tests */
      /* istanbul ignore next */
      if (!fromSkipTutorial) tutorialCongratsBannerRef?.current?.scrollToIndex({ index: 1 });
    }, Number(ENV.TUTORIAL.BANNER.CONGRATS_DELAY_MS));
    const secondTimeout = setTimeout(
      () => {
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 0,
          duration: 1000
        }).start();
      },
      !fromSkipTutorial ? Number(ENV.TUTORIAL.BANNER.CHECK_DELAY_MS) : Number(ENV.TUTORIAL.BANNER.CHECK_DELAY_FROM_SKIP_MS)
    );
    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  }, [fromSkipTutorial, fadeAnim]);

  const renderItem = useCallback(
    ({ item: { text, icon }, index }): ReactElement<FlatListProps<any>> => (
      <View style={styles.itemContainer} key={index} {...getTestIdProps('item')}>
        <Text style={styles.text} {...getTestIdProps('item-text')}>
          {text}
        </Text>
        {icon}
      </View>
    ),
    [getTestIdProps]
  );

  return (
    <Animated.FlatList
      {...getTestIdProps('container')}
      onScrollToIndexFailed={noop}
      ref={tutorialCongratsBannerRef}
      bounces={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      style={[styles.container, { opacity: fadeAnim }]}
      data={bannerData}
      renderItem={renderItem}
    />
  );
};

export default memo(TutorialCongratsBanner);
