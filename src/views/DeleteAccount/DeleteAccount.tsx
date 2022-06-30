import React, { useCallback, useContext } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import { Text } from '_components/Text';
import { styles } from './styles';
import { ENV, FONT_FAMILY, ForterActionType, PageType, TealiumEventType, UxObject } from '_constants';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useEventTracker } from '_state_mgmt/core/hooks';

const subject = 'Account Deletion Request';

const DeleteAccount = () => {
  const {
    state: {
      user: {
        currentUser: {
          personal: { sywMemberNumber }
        }
      }
    },
    deps: {
      nativeHelperService: {
        linking: { openURL }
      }
    }
  } = useContext(GlobalContext);

  const { trackUserEvent } = useEventTracker();
  const { getTestIdProps } = useTestingHelper('delete-account');

  const onEditProfileOnSYW = useCallback(() => {
    trackUserEvent(
      TealiumEventType.PROFILE,
      {
        event_type: PageType.DELETE_SYW_ACCOUNT,
        uxObject: UxObject.BUTTON,
        event_detail: 'delete_account_email',
        exit_link: ENV.SYW_URL
      },
      ForterActionType.TAP
    );
    openURL(`mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=${subject}&body=${sywMemberNumber} has requested that their account be deleted.`);
  }, [trackUserEvent, sywMemberNumber, openURL]);

  return (
    <View style={styles.container}>
      <Image style={styles.deleteIcon as any} source={require('_assets/shared/deleteAccountIcon.png')} />
      <Text font={FONT_FAMILY.HEAVY} style={styles.title}>
        We're sad you're leaving!
      </Text>
      <Text style={styles.textContent}>
        If you delete the account, all your information within Shop Your Way MAX will be removed, including points earned. This action can only be done by
        contacting our customer service.
      </Text>
      <Text font={FONT_FAMILY.HEAVY} style={styles.email}>
        E-mail:
      </Text>
      <TouchableOpacity onPress={onEditProfileOnSYW} {...getTestIdProps('support-email')}>
        <Text style={styles.link}>{ENV.SYW_SUPPORT_EMAIL}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;
