import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Image from 'react-native-fast-image';
import { StackHeaderProps } from '@react-navigation/stack';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '_commons/components/atoms/Icon';
import { FONT_FAMILY, COLOR, ROUTES, ICON, FONT_SIZE } from '_constants';
import { Button } from '_views/shared/Button';
import { Text } from '_views/shared/Text';
import { formatPrettyTitle } from '_utils/formatPrettyTitle';
import { useAvatarUrl } from '_utils/useAvatarUrl';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props extends StackHeaderProps {
  searchBar?: React.ReactNode;
  showGoBackCrossBtnByOption?: boolean;
  headerRight?: React.ReactNode;
}

export const NavigationHeader = ({ scene, navigation, searchBar, showGoBackCrossBtnByOption, headerRight }: Props) => {
  const {
    showAvatar,
    avatarUrl,
    title,
    transparentBackground,
    bottomShadow,
    hideGoBackArrowBtn,
    showGoBackCrossBtn,
    style,
    showTitle = true
  } = scene?.route?.params || ({} as any);
  const headerTitle = showTitle ? formatPrettyTitle(title || scene?.route?.name).toUpperCase() : '';
  const [avatar, onAvatarError] = useAvatarUrl(avatarUrl);
  const { getTestIdProps } = useTestingHelper('navigation-header');

  const noRightContent = useMemo(() => {
    return !showGoBackCrossBtn && !showGoBackCrossBtnByOption && !showAvatar;
  }, [showAvatar, showGoBackCrossBtn, showGoBackCrossBtnByOption]);

  return (
    <SafeAreaView style={[styles.safeArea, searchBar && styles.searchBarColored]} edges={['left', 'right']}>
      <View
        style={[
          styles.container,
          transparentBackground ? styles.transparentContainer : styles.coloredContainer,
          style,
          bottomShadow && styles.shadow,
          searchBar && styles.searchBarColored
        ]}
      >
        {hideGoBackArrowBtn || showGoBackCrossBtnByOption ? (
          <View />
        ) : (
          <Button
            onPress={navigation.goBack}
            containerColor={searchBar ? COLOR.TRANSPARENT : COLOR.WHITE}
            innerContainerStyle={styles.backBtn}
            {...getTestIdProps('back-arrow-button')}
          >
            <Icon name={ICON.ARROW_LEFT} width={15} height={15} color={searchBar ? COLOR.WHITE : COLOR.BLACK} />
          </Button>
        )}
        <View style={[styles.centerContainer, noRightContent && searchBar && styles.removeRightPadding]}>
          {searchBar ?? (
            <Text font={FONT_FAMILY.BOLD} style={styles.title} {...getTestIdProps('title')}>
              {headerTitle}
            </Text>
          )}
        </View>
        {showGoBackCrossBtn || showGoBackCrossBtnByOption ? (
          <TouchableOpacity onPress={navigation.goBack} style={styles.closeBtn} {...getTestIdProps('back-cross-button')}>
            <Icon name={ICON.CLOSE} size={FONT_SIZE.HUGE} color={COLOR.BLACK} />
          </TouchableOpacity>
        ) : null}
        {!showAvatar ? null : (
          <View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PROFILE)} {...getTestIdProps('avatar-button')}>
              <Image style={styles.tinyAvatar as any} source={avatar} onError={onAvatarError} />
            </TouchableOpacity>
          </View>
        )}
        {noRightContent && <View />}
        {headerRight ? <View {...getTestIdProps('right')}>{headerRight}</View> : null}
      </View>
    </SafeAreaView>
  );
};

export default memo(withSafeAreaInsets(NavigationHeader));
