import React, { memo } from 'react';
import { View } from 'react-native';

import CloseWhite from '_assets/button/closeWhite.svg';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Button } from '_components/Button';
import { COLOR, CONTAINER_STYLE, FONT_SIZE, ICON } from '_constants';
import { Title } from '_components/Title';
import { Text } from '_components/Text';
import { Icon } from '_commons/components/atoms/Icon';

import { styles } from './styles';

export interface Props {
  onPress: () => void;
}
const RewardDetailEmptyState = ({ onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('reward-detail-empty-state');

  return (
    <View style={styles.emptyStateContainer} {...getTestIdProps('container')}>
      <View style={styles.emptyStateHeader}>
        <View style={styles.emptyStateHeaderContent}>
          <Button
            onPress={onPress}
            {...getTestIdProps('close-btn')}
            containerColor={COLOR.BLACK}
            innerContainerStyle={[CONTAINER_STYLE.shadow, { width: 35, height: 35 }]}
          >
            <CloseWhite width={10} height={10} />
          </Button>
        </View>
      </View>
      <View style={styles.emptyStateBody}>
        <Icon name={ICON.CUSTOM_SEARCH} size={FONT_SIZE.XXL} backgroundStyle={styles.iconBackground} innerBackgroundStyle={styles.iconInnerBackground} />

        <Title style={styles.emptyStateTitle}>
          Whoops! This Gift Card is{'\n'}
          not available at this time.
        </Title>
        <Text style={styles.emptyStateSubtitle}>
          But don't worry! You can see our whole catalog of Gift Cards in the{'\n'}
          Rewards section by leaving this page{'\n'}
          with the close button.
        </Text>
      </View>
    </View>
  );
};

export default memo(RewardDetailEmptyState);
