import React, { memo } from 'react';
import { View } from 'react-native';
import moment from 'moment';

import { styles } from './styles';
import { ActivityModel } from '../../../models';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Text } from '../Text';
import { BrandLogo } from '../BrandLogo';
import { FONT_FAMILY } from '../../../constants';

export interface Props {
  activity: ActivityModel.IActivity;
}

export const ConfirmedPurchaseCard = ({ activity }: Props) => {
  const { getTestIdProps } = useTestingHelper('confirmed-purchase-card');

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.detail}>
        <Text numberOfLines={1} ellipsizeMode="tail" font={FONT_FAMILY.BOLD} style={styles.title}>
          {activity.requestorName}
        </Text>
        <Text style={styles.subTitle}>{moment(activity.timestamp).format('D MMMM, hh:mm a')}</Text>
      </View>
      <BrandLogo image={activity.brandDetails?.brandLogo} activityType={activity?.activityType} size={40} />
    </View>
  );
};

export default memo(ConfirmedPurchaseCard);
