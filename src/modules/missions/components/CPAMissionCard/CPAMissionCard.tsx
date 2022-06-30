import React, { memo } from 'react';
import { TouchableHighlight } from 'react-native';

import { ImageCard } from '_commons/components/atoms/ImageCard';
import { MissionModel } from '_models';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  mission: MissionModel.IMission;
  onPress?: () => void;
}

const CPAMissionCard = ({ mission, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('cpa-mission-card');
  return (
    <TouchableHighlight style={styles.container} underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <ImageCard imageUrl={mission.image} resizeMode="contain" />
    </TouchableHighlight>
  );
};

export default memo(CPAMissionCard);
