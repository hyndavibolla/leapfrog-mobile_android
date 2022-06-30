import React, { memo, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableHighlight, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import Image from 'react-native-fast-image';

import { Button } from '_components/Button';
import { Modal, ModalSize, ModalTitle, ModalSubtitle } from '_components/Modal';
import { Text } from '_components/Text';
import { Divider } from '_components/Divider/Divider';
import { YourPinNumberModal } from '_components/YourPinNumberModal/YourPinNumberModal';
import { RowItem } from './components/RowItem';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useLogout } from '_state_mgmt/auth/hooks';
import { useCCPA, useEventTracker } from '_state_mgmt/core/hooks';
import { actions } from '_state_mgmt/core/actions';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { useAvatarUrl } from '_utils/useAvatarUrl';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useSid } from '_utils/useSid';
import { usePushNotificationsPermission } from '_commons/hooks/usePushNotificationsPermission';

import { ENV, ROUTES, PageType, COLOR, TealiumEventType, ForterActionType, FONT_SIZE, ICON, UxObject, TutorialFrom } from '_constants';

import LogoutIcon from '_assets/shared/logoutIcon.svg';
import GoOutIconDarkGrey from '_assets/shared/goOutIconDarkGrey.svg';

import { styles } from './styles';
import { BackButton } from '_commons/components/molecules/Backbutton/BackButton';
import { Icon } from '_commons/components/atoms/Icon';

export const Profile = ({ navigation }) => {
  const { state, deps, dispatch } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('profile');
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);
  const [onLogout, isLoggingOut] = useLogout();
  const { resetSetting, showBanner } = useCCPA();
  const [avatarUrl, onAvatarError] = useAvatarUrl(state.user.currentUser.avatarUrl);
  const [onResetSetting] = resetSetting;
  const [onShowBanner] = showBanner;
  const { trackUserEvent } = useEventTracker();
  const [getStoredSid] = useSid();
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const editProfileUrl = useMemo(() => `${ENV.SYW_URL}m/dashboard/account?`, []);
  const { handleNotificationPermissionCheck, notificationsEnabled, handlePushNotifications } = usePushNotificationsPermission();

  useEffect(() => {
    handleNotificationPermissionCheck();
  }, [handleNotificationPermissionCheck]);

  const [onManageCookiePreferences] = useAsyncCallback(async () => {
    await onResetSetting();
    await onShowBanner();
  }, [onResetSetting, onShowBanner]);

  const onEditProfileOnSYW = useCallback(async () => {
    trackUserEvent(
      TealiumEventType.EDIT_SYW_ACCOUNT,
      {
        page_type: PageType.ACCOUNT,
        event_type: TealiumEventType.ACCOUNT,
        exit_link: ENV.SYW_URL
      },
      ForterActionType.TAP
    );
    const storedSid = await getStoredSid();
    const trackingParameters = storedSid ? `intcmp=iMAXxEditProfile&sid=${storedSid}` : 'intcmp=iMAXxEditProfile';
    navigation.navigate(ROUTES.EDIT_PROFILE, { uri: `${editProfileUrl}${trackingParameters}` });
  }, [trackUserEvent, getStoredSid, editProfileUrl, navigation]);

  const onDeleteAccount = useCallback(() => {
    trackUserEvent(
      TealiumEventType.PROFILE,
      {
        event_type: PageType.DELETE_SYW_ACCOUNT,
        uxObject: UxObject.BUTTON,
        event_detail: 'delete_account',
        exit_link: ENV.SYW_URL
      },
      ForterActionType.TAP
    );

    navigation.navigate(ROUTES.DELETE_ACCOUNT);
  }, [trackUserEvent, navigation]);

  const handleAppTutorial = useCallback(() => {
    dispatch(actions.setTutorialFrom(TutorialFrom.PROFILE));
    navigation.navigate(ROUTES.MAIN_TAB.EARN, { isShowTutorial: true });
  }, [dispatch, navigation]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.topContainer}>
          <ImageBackground
            style={styles.backgroundContainer}
            imageStyle={{ flex: 1, resizeMode: 'repeat', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
            source={require('_assets/shared/pointBalancePatternAsset2x.png')}
          >
            <View style={styles.fakeNavigation}>
              <BackButton containerStyle={styles.backButtonContainer} />
              <Text style={styles.navigationTitle}>YOUR ACCOUNT</Text>
            </View>
            <Image style={styles.avatar as any} source={avatarUrl} onError={onAvatarError} />
            <Text style={styles.profileName}>{`${state.user.currentUser.firstName} ${state.user.currentUser.lastName}`}</Text>
            <Text style={styles.profileEmail}>{state.user.currentUser.email}</Text>
          </ImageBackground>
        </View>
        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}>Settings</Text>
          <RowItem name="Edit your profile" onPress={onEditProfileOnSYW} testIdName="edit-profile" icon={<GoOutIconDarkGrey />} />
          <RowItem
            name="Your member number and PIN"
            onPress={() => setIsPinModalVisible(true)}
            testIdName="member-number-pin"
            icon={<Icon name={ICON.BAR_CODE} size={FONT_SIZE.BIG} color={COLOR.DARK_GRAY} />}
          />
          <RowItem
            name="Push Notifications"
            onPress={handlePushNotifications}
            testIdName="push-notifications"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
            value={notificationsEnabled ? 'ON' : 'OFF'}
          />
          <Text style={styles.linksTitle}>App information</Text>
          {state.core.isTutorialAvailable && (
            <RowItem
              name="App tutorial"
              onPress={handleAppTutorial}
              testIdName="app-tutorial"
              icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
            />
          )}
          <RowItem
            name="How do points work?"
            onPress={() => navigation.navigate(ROUTES.HOW_IT_WORKS.TITLE)}
            testIdName="how-points-work"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
          />
          <RowItem
            name="FAQs"
            onPress={() => navigation.navigate(ROUTES.HOW_IT_WORKS.TITLE, { screen: ROUTES.HOW_IT_WORKS.FAQ })}
            testIdName="faqs"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
          />
          <Text style={styles.linksTitle}>Legal Information</Text>
          <RowItem
            name="Terms and Conditions"
            onPress={() => navigation.navigate(ROUTES.TERMS_AND_CONDITIONS)}
            testIdName="terms-and-conditions"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
          />
          <RowItem
            name="Privacy Policy"
            onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
            testIdName="privacy-policy"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
          />
          <RowItem
            name="Manage Cookie Preferences"
            onPress={onManageCookiePreferences}
            testIdName="ccpa-btn"
            icon={<Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />}
          />
          <TouchableOpacity onPress={() => setIsLogoutModalVisible(true)} {...getTestIdProps('sign-out')}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteAccount} {...getTestIdProps('delete-account')}>
            <Text style={styles.deleteAccountTitle}>Delete account</Text>
          </TouchableOpacity>
          <Divider containerStyle={styles.dividerContainer} lineStyle={styles.dividerStyle} />
          <Text style={styles.supportTitle}>CUSTOMER SUPPORT CONTACT</Text>
          <TouchableOpacity
            onPress={() => deps.nativeHelperService.linking.openURL(`mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=SYW MAX - Customer Support`)}
            {...getTestIdProps('support-email')}
          >
            <Text style={styles.supportText}>{ENV.SYW_SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
          <Text style={styles.supportTitle}>{deps.nativeHelperService.deviceInfo.getReadableVersion()}</Text>
        </View>
      </ScrollView>
      <Modal size={ModalSize.DYNAMIC} visible={isLogoutModalVisible} onClose={() => setIsLogoutModalVisible(false)}>
        <LogoutIcon width={60} height={60} />
        <ModalTitle>Are you sure you want to sign out?</ModalTitle>
        <ModalSubtitle>You will have to login again.</ModalSubtitle>

        <View style={styles.selectionBtnContainer}>
          <Button
            disabled={isLoggingOut}
            onPress={() => {
              onLogout();
              setTimeout(() => {
                setIsLogoutModalVisible(false);
              }, 2000);
            }}
            innerContainerStyle={styles.btn}
            {...getTestIdProps('modal-sign-out')}
          >
            <Text style={styles.btnText}>Sign Out</Text>
          </Button>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => setIsLogoutModalVisible(false)}
            style={styles.cancelBtn}
            {...getTestIdProps('modal-cancel-sign-out')}
          >
            <Text style={[styles.btnText, styles.btnTextCancel]}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </Modal>
      <YourPinNumberModal visible={isPinModalVisible} onClose={() => setIsPinModalVisible(false)} />
    </>
  );
};

export default memo(Profile);
