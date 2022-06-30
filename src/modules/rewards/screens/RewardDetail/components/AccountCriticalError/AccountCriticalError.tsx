import React, { memo, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

import AvatarWarn from '_assets/shared/avatarWarn.svg';
import { Divider } from '_views/shared/Divider';
import { Text } from '_views/shared/Text';
import { Title, TitleType } from '_views/shared/Title';
import { useLogout } from '_state_mgmt/auth/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import { FONT_FAMILY } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { styles } from './styles';

export interface Props {
  hideSignOut?: boolean;
}

export const AccountCriticalError = ({ hideSignOut = false }: Props) => {
  const { deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('account-critical-error');
  const [onLogout, isLoggingOut] = useLogout();
  const email = 'sywsolutions@syw.com';

  return (
    <View {...getTestIdProps('container')} style={styles.container}>
      <View style={styles.infoContainer}>
        <AvatarWarn />
        <Title type={TitleType.HEADER} style={styles.titleText}>
          Something went wrong with your account.
        </Title>
        <Text style={styles.subtitleText}>To continue using Shop Your Way ® MAX, please contact us on:</Text>
        <TouchableOpacity
          onPress={() => deps.nativeHelperService.linking.openURL(`mailto:${email}?subject=SYW MAX - Account Support`)}
          {...getTestIdProps('link')}
        >
          <Text font={FONT_FAMILY.BOLD} style={styles.linkText}>
            {email}
          </Text>
        </TouchableOpacity>
        <Text style={styles.subtitleText}>We apologize for any inconvenience you're experiencing.</Text>
      </View>
      {!hideSignOut && (
        <>
          <View style={styles.dividerContainer}>
            <Divider lineStyle={styles.lineStyle} />
          </View>
          <View style={styles.actionContainer} {...getTestIdProps('logout-container')}>
            <TouchableOpacity onPress={onLogout} disabled={isLoggingOut} {...getTestIdProps('logout-btn')}>
              <Text font={FONT_FAMILY.BOLD} style={styles.signOutBtn}>
                Sign out
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(AccountCriticalError);
