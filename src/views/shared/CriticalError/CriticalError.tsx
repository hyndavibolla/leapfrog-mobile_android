import React, { memo, useContext } from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import CriticalErrorIcon from '../../../assets/shared/criticalError.svg';
import { Text } from '../Text';
import { FONT_FAMILY } from '../../../constants';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Button } from '../Button';
import { useLogout } from '../../../state-mgmt/auth/hooks';

export const CriticalError = () => {
  const { getTestIdProps } = useTestingHelper('critical-error');
  const { deps } = useContext(GlobalContext);
  const [onLogout, isLoading] = useLogout();

  const onRestart = deps.apiService.isTokenInvalid ? onLogout : deps.nativeHelperService.restart;

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <CriticalErrorIcon />
      <View style={styles.textContainer}>
        <Text font={FONT_FAMILY.HEAVY} style={styles.title}>
          {'Something went wrong :('}
        </Text>
        <Text style={styles.text}>We are fixing this problem. Please, try again later.</Text>
      </View>
      <View>
        <Button innerContainerStyle={styles.button} textStyle={styles.buttonText} onPress={onRestart} disabled={isLoading} {...getTestIdProps('refresh-btn')}>
          Refresh the app
        </Button>
      </View>
    </View>
  );
};

export default memo(CriticalError);
