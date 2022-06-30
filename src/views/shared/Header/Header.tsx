import React, { memo, useContext, useCallback } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Image from 'react-native-fast-image';

import SYWLogo from '_assets/shared/sywLogo.svg';
import { ROUTES } from '_constants/routes';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useAvatarUrl } from '_utils/useAvatarUrl';
import { useTestingHelper } from '_utils/useTestingHelper';
import { PointPill } from '_commons/components/molecules/PointPill';
import { ICON } from '_constants';
import { initialState as gameInitialState } from '_state_mgmt/game/state';

import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
  logo?: React.ReactNode;
  userPoints?: number;
  avatarUrl?: string;
  onPointsPress?: () => void;
  onProfilePress?: () => void;
}

export const Header = ({ navigation, logo, userPoints, avatarUrl, onPointsPress, onProfilePress }: Props) => {
  const { getTestIdProps } = useTestingHelper('header');
  const {
    state: {
      core: { isTutorialVisible },
      user: {
        currentUser: { avatarUrl: avatarUrlState }
      },
      game: {
        current: {
          balance: { availablePoints }
        }
      }
    }
  } = useContext(GlobalContext);
  const [avatar, onAvatarError] = useAvatarUrl(avatarUrl ?? avatarUrlState);

  const getNavigateToPointHistory = useCallback(() => navigation.navigate(ROUTES.POINT_HISTORY), [navigation]);
  const getNavigateToProfile = useCallback(() => navigation.navigate(ROUTES.PROFILE, { avatarUrl: avatar }), [avatar, navigation]);

  userPoints = userPoints ?? availablePoints ?? gameInitialState.current.balance.availablePoints;
  onPointsPress = onPointsPress ?? getNavigateToPointHistory;
  onProfilePress = onProfilePress ?? getNavigateToProfile;

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.headerTop}>
        <View style={[styles.logoContainer, isTutorialVisible && styles.tutorialVisible]} {...getTestIdProps('logo')}>
          {logo ? logo : <SYWLogo />}
        </View>
        <TouchableHighlight onPress={onPointsPress} underlayColor="transparent" activeOpacity={1} {...getTestIdProps('points-btn')}>
          <PointPill icon={ICON.SYW_CIRCLE} points={userPoints} />
        </TouchableHighlight>
        <TouchableHighlight onPress={onProfilePress} underlayColor="transparent" activeOpacity={1} {...getTestIdProps('profile-btn')}>
          <View style={styles.userContainer}>
            <Image style={styles.tinyLogo as any} source={avatar} onError={onAvatarError} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default memo(Header);
