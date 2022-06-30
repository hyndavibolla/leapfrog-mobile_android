import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '_components/Button';
import { Icon } from '_commons/components/atoms/Icon';
import GiftEmoji from '_assets/shared/giftEmoji.svg';
import SmileyFaceEmoji from '_assets/shared/smileyFaceEmoji.svg';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ROUTES, ICON, FONT_SIZE, COLOR } from '_constants';

import { styles } from './styles';

export interface Props {
  title: string;
  description?: string;
}

function EmptyState({ title, description }: Props) {
  const { getTestIdProps } = useTestingHelper('gift-cards-screen-empty-state');
  const { navigate } = useNavigation();

  return (
    <View style={styles.emptyStateContainer} {...getTestIdProps('container')}>
      <View style={styles.emptyStateIconsContainer}>
        <View style={[styles.iconContainer, styles.iconContainerLeft]}>
          <GiftEmoji height={32} width={32} />
        </View>
        <View style={[styles.iconContainer, styles.iconContainerRight]}>
          <SmileyFaceEmoji height={32} width={32} />
        </View>
      </View>
      <Text style={[styles.emptyStateTitle, { marginBottom: description ? 12 : 20 }]} {...getTestIdProps('title')}>
        {title}
      </Text>
      {description ? (
        <Text style={styles.emptyStateSubtitle} {...getTestIdProps('description')}>
          {description}
        </Text>
      ) : null}
      <Button
        style={styles.emptyStateBtn}
        innerContainerStyle={styles.innerButton}
        textStyle={styles.buttonText}
        onPress={() => navigate(ROUTES.MAIN_TAB.REWARDS)}
        {...getTestIdProps('buy-gift-card-button')}
      >
        Buy Gift Cards <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.SMALLER} color={COLOR.WHITE} />
      </Button>
    </View>
  );
}

export default memo(EmptyState);
