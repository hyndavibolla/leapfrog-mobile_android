import React, { memo, useCallback, useContext } from 'react';
import { View } from 'react-native';
import Image from 'react-native-fast-image';

import { Text } from '../../shared/Text';
import { styles } from './styles';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Title, TitleType } from '../Title';
import { Button } from '../Button';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { ENV } from '../../../constants';

export interface Props {
  isUpdateRequired: boolean;
  onClose?: () => void;
}

export const UpdateModal = ({ isUpdateRequired, onClose }: Props) => {
  const { getTestIdProps } = useTestingHelper('update-modal');
  const { deps } = useContext(GlobalContext);

  const onUpdate = useCallback(() => {
    deps.nativeHelperService.linking.openURL(
      deps.nativeHelperService.platform.select({ android: ENV.STORE_URL.ANDROID, ios: ENV.STORE_URL.IOS, default: ENV.STORE_URL.IOS })
    );
  }, [deps.nativeHelperService]);

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <Image style={styles.swyLogo as any} source={require('../../../assets/shared/swyLogo.png')} resizeMode="cover" />
      <Title style={styles.title} type={TitleType.SECTION}>
        {"Hey! There's a new version of \nSYW MAX available."}
      </Title>
      <Text style={styles.message}>Update now and keep earning points with your favorite brands!</Text>
      <View style={styles.btnContainer}>
        <Button innerContainerStyle={styles.updateBtnInnerContainer} textStyle={styles.updateBtnText} onPress={onUpdate} {...getTestIdProps('update-btn')}>
          Update now
        </Button>
      </View>
      {isUpdateRequired ? null : (
        <Button innerContainerStyle={styles.dismissBtnInnerContainer} textStyle={styles.dismissBtnText} onPress={onClose} {...getTestIdProps('close-btn')}>
          I'll do this later
        </Button>
      )}
    </View>
  );
};

export default memo(UpdateModal);
