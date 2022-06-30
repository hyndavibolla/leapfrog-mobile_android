import React, { memo } from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Title, TitleType } from '../Title';
import { Button } from '../Button';
import ExclamationCircle from '../../../assets/shared/exclamationCircle.svg';

export interface Props {
  onLeaveSurvey?: () => void;
  onCancel?: () => void;
}

export const LeaveSurveyModal = ({ onLeaveSurvey, onCancel }: Props) => {
  const { getTestIdProps } = useTestingHelper('leave-survey-modal');
  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <ExclamationCircle style={styles.swyLogo as any} />
      <Title style={styles.title} type={TitleType.SECTION}>
        Do you want to leave Surveys?
      </Title>
      <Button innerContainerStyle={styles.updateBtnInnerContainer} textStyle={styles.updateBtnText} onPress={onLeaveSurvey} {...getTestIdProps('leave-btn')}>
        Yes, leave Surveys
      </Button>
      <Button innerContainerStyle={styles.dismissBtnInnerContainer} textStyle={styles.dismissBtnText} onPress={onCancel} {...getTestIdProps('cancel-btn')}>
        Cancel
      </Button>
    </View>
  );
};

export default memo(LeaveSurveyModal);
