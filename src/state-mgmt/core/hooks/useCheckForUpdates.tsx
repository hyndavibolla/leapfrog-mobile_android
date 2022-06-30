import React, { useCallback, useContext } from 'react';

import { ENV } from '../../../constants';
import { RemoteConfigModel } from '../../../models/general';
import { parseBuildNumber } from '../../../utils/parseBuildNumber';
import { ModalSize } from '../../../views/shared/Modal';
import { UpdateModal } from '../../../views/shared/UpdateModal';
import { GlobalContext } from '../../GlobalState';
import { actions } from '../actions';

export const useCheckForUpdates = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  return useCallback(async () => {
    try {
      const buildNumber = parseBuildNumber(deps.nativeHelperService.deviceInfo.getBuildNumber());
      deps.logger.info('Checking for updates', { buildNumber });

      const modalKey = 'update-modal';
      const onRequiredFound = () => dispatch(actions.setForcedUpdateScreen(true));

      const immediateRemoteVersionConfig = deps.remoteConfigService.getImmediateValue<RemoteConfigModel.IAppVersion>(ENV.REMOTE_CONFIG.KEY.APP_VERSION);
      if (buildNumber < immediateRemoteVersionConfig.required) {
        deps.logger.debug(`Required version (cached) (${immediateRemoteVersionConfig.required}) is higher than current version ${buildNumber}`);
        return onRequiredFound();
      }

      deps.remoteConfigService.fetchAndActivate(); // we don't await for this one (no rejections are possible). This is for the next time this hook runs

      const remoteVersionConfig = await deps.remoteConfigService.getValue<RemoteConfigModel.IAppVersion>(ENV.REMOTE_CONFIG.KEY.APP_VERSION);
      if (buildNumber < remoteVersionConfig.required) {
        deps.logger.debug(`Required version (${remoteVersionConfig.required}) is higher than current version ${buildNumber}`);
        return onRequiredFound();
      }

      // reset forced update screen state
      dispatch(actions.setForcedUpdateScreen(false));

      const lastSuggestedBuildVersion = await deps.nativeHelperService.storage.get<number>(ENV.STORAGE_KEY.LAST_SUGGESTED_BUILD_VERSION);
      if (buildNumber < remoteVersionConfig.suggested && lastSuggestedBuildVersion < remoteVersionConfig.suggested) {
        deps.logger.debug(`Suggested version (${remoteVersionConfig.suggested}) is higher than current version ${buildNumber}`);
        dispatch(
          actions.addModal(modalKey, {
            size: ModalSize.FULL_SCREEN,
            showCloseButton: true,
            children: <UpdateModal isUpdateRequired={false} onClose={/* istanbul ignore next */ () => dispatch(actions.removeModal(modalKey))} />
          })
        );
        await deps.nativeHelperService.storage.set<number>(ENV.STORAGE_KEY.LAST_SUGGESTED_BUILD_VERSION, remoteVersionConfig.suggested);
      }
    } catch (error) {
      deps.logger.error(error, { context: 'Error checking for updates' });
    }
  }, [deps.nativeHelperService, deps.logger, deps.remoteConfigService, dispatch]);
};
