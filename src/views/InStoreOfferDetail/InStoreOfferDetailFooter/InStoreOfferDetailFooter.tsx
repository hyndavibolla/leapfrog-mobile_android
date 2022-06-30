import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ICON, COLOR, FONT_SIZE } from '_constants';
import { Icon } from '_commons/components/atoms/Icon';
import { Pill } from '_components/Pill';
import { useTestingHelper } from '_utils/useTestingHelper';

import styles from './styles';

interface Props {
  rewardText: string;
  isActive: boolean;
  disabled: boolean;
  onActivateRequested: () => void;
}

function InStoreOfferDetailFooter({ rewardText, isActive, disabled, onActivateRequested }: Props) {
  const { getTestIdProps } = useTestingHelper('in-store-offer-detail-footer');
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.rewardsTitle}>REWARDS</Text>
        <View style={styles.rewardsCol}>
          <Pill textFallback={'Local Offer'} isDisabled={!isActive}>
            {rewardText}
          </Pill>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          {...getTestIdProps('activate-btn')}
          disabled={disabled || isActive}
          onPress={onActivateRequested}
          style={isActive ? styles.buttonActivated : styles.button}
        >
          {isActive && <Icon name={ICON.TICK} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.PETITE} />}
          <Text {...getTestIdProps('activate-btn-text')} style={isActive ? styles.buttonTextActivated : styles.buttonText}>
            {isActive ? 'Activated' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(InStoreOfferDetailFooter);
