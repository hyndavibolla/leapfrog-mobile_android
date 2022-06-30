import React, { memo } from 'react';
import { StackHeaderProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Button } from '_components/Button';
import { ImageBackgroundWithFallback } from '_components/ImageBackgroundWithFallback';
import { COLOR, CONTAINER_STYLE, FONT_SIZE, ICON } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props extends StackHeaderProps {
  backgroundSrc: string;
  searchBar?: React.ReactNode;
}

export const CategoryNavigationHeader = ({ backgroundSrc, navigation, searchBar }: Props) => {
  const { getTestIdProps } = useTestingHelper('category-navigation-header');
  return (
    <ImageBackgroundWithFallback
      containerStyle={styles.backgroundContainer}
      source={{ uri: backgroundSrc }}
      fallbackSource={require('_assets/shared/categoryBackgroundFallback.png')}
    >
      <StatusBar translucent backgroundColor={COLOR.TRANSPARENT} barStyle="light-content" />
      <SafeAreaView style={[styles.safeArea]} edges={['top']}>
        <View style={styles.body}>
          <View style={styles.container}>
            <Button onPress={navigation?.goBack} containerColor={COLOR.WHITE} innerContainerStyle={[CONTAINER_STYLE.shadow, styles.closeBtn]}>
              <Icon name={ICON.ARROW_LEFT} color={COLOR.BLACK} size={FONT_SIZE.SMALLER} />
            </Button>
            {searchBar && (
              <View {...getTestIdProps('search-bar')} style={styles.searchBarContainer}>
                {searchBar}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackgroundWithFallback>
  );
};

export default memo(CategoryNavigationHeader);
