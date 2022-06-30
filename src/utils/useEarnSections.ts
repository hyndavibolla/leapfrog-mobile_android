import { useContext } from 'react';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useErrorLog } from '_state_mgmt/core/hooks';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { RemoteConfigModel } from '_models/general';
import { ENV } from '_constants';
import { EarnSectionsData } from '_modules/earn/screens/EarnMain/constants';

export const useEarnSections = () => {
  const { deps } = useContext(GlobalContext);
  const fetchState: [() => Promise<RemoteConfigModel.IEarnSection[]>, boolean, any, RemoteConfigModel.IEarnSection[]] = useAsyncCallback(async () => {
    deps.logger.info('Getting Earn Sections remote config');
    let remoteEarnSectionsConfig = await deps.remoteConfigService.getValue<RemoteConfigModel.IEarnSection[]>(ENV.REMOTE_CONFIG.KEY.EARN_SECTIONS);

    if (!remoteEarnSectionsConfig) {
      remoteEarnSectionsConfig = deps.remoteConfigService.getImmediateValue<RemoteConfigModel.IEarnSection[]>(ENV.REMOTE_CONFIG.KEY.EARN_SECTIONS);
    }

    const sections = remoteEarnSectionsConfig?.length > 0 ? remoteEarnSectionsConfig : EarnSectionsData.sections;

    const visibleSections = sections.filter(section => section.visible).sort((a, b) => a.order - b.order);

    return visibleSections;
  }, []);
  useErrorLog(fetchState[2], 'There was an issue fetching Earn Sections remote config');
  return fetchState;
};
