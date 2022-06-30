/* istanbul ignore file */

import React, { memo, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Link } from '@react-navigation/native';

import { FeatureFlag, IApiOverrideRule } from '../../../models/general';
import { Flagged } from '../Flagged';
import { shouldShowFeature } from '_components/Flagged';
import { ENV, ROUTES } from '../../../constants';
import { Text } from '../Text';
import { styles } from './styles';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { useAsyncCallback } from '../../../utils/useAsyncCallback';

export const EnvBanner = () => {
  const { deps, state } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('env-banner');
  const [onReloadSettingList, , , savedSettingList] = useAsyncCallback<any, IApiOverrideRule[]>(
    () => deps.nativeHelperService.storage.get(ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS),
    []
  );

  useEffect(() => {
    onReloadSettingList();
  }, [onReloadSettingList]);

  return (
    <Flagged feature={FeatureFlag.ENV_BANNER}>
      <View style={[styles.envBanner, savedSettingList?.length && styles.envBannerOverride]} {...getTestIdProps('container')}>
        {shouldShowFeature(FeatureFlag.LOG_VIEW) ? (
          <Link to={`/${ROUTES.DEV_TOOLS}`}>
            <View style={styles.envBannerTextContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.envBannerText, { width: deps.nativeHelperService.dimensions.getWindowWidth() / 2 - 6 + 50, textAlign: 'left' }]}
                {...getTestIdProps('branch-name-and-env-name')}
              >
                {ENV.ENVIRONMENT} ({ENV.BRANCH_NAME})
              </Text>
              <Text
                style={[styles.envBannerText, { width: deps.nativeHelperService.dimensions.getWindowWidth() / 2 - 6 - 50, textAlign: 'right' }]}
                {...getTestIdProps('app-version-and-member-number')}
              >
                v{ENV.APP_VERSION} ({deps.nativeHelperService.deviceInfo.getReadableVersion()}){'\n'}
                <Text style={styles.memberNumber}>{state.user.currentUser.personal.sywMemberNumber}</Text>
              </Text>
            </View>
          </Link>
        ) : (
          <Text style={styles.envBanner}>
            <View style={styles.envBannerTextContainer}>
              <Text style={styles.envBannerText} {...getTestIdProps('branch-name-and-env-name')}>
                {ENV.ENVIRONMENT} ({ENV.BRANCH_NAME})
              </Text>
              <Text style={styles.envBannerText} {...getTestIdProps('app-version-and-member-number')}>
                v{ENV.APP_VERSION} ({deps.nativeHelperService.deviceInfo.getReadableVersion()}) v{ENV.APP_VERSION} (
                {deps.nativeHelperService.deviceInfo.getReadableVersion()}){'\n'}
                <Text style={styles.memberNumber}>{state.user.currentUser.personal.sywMemberNumber}</Text>
              </Text>
            </View>
          </Text>
        )}
      </View>
    </Flagged>
  );
};

export default memo(EnvBanner);
