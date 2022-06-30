import React, { memo, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebViewNavigation } from 'react-native-webview';

import { CriticalError } from '_components/CriticalError';
import { WebView } from '_components/WebView/WebView';
import { ConnectionBanner } from '_components/ConnectionBanner';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { useGetLinkedCardsList } from '_state_mgmt/cardLink/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Provider } from '_models/mission';
import { ENV } from '_constants';
import { actions } from '_state_mgmt/cardLink/actions';

export interface Props {
  navigation: StackNavigationProp<any>;
  route: { params?: { shouldActivateOffer?: boolean } };
}

const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
const { ENROLLMENT_FINISH_URI_REGEX: enrollmentFinishUriRegex } = ENV.LOCAL_OFFERS;

export const CardLink = ({ navigation, route }: Props) => {
  const { deps, dispatch } = useContext(GlobalContext);
  const [isHttpError, setIsHttpError] = useState(false);
  const [onLoadLinkedCardsList] = useGetLinkedCardsList();
  const [navigationLoaded, setNavigationLoaded] = useState<boolean>(false);
  const shouldActivateOffer = route.params?.shouldActivateOffer ?? false;

  const {
    state: {
      core: { routeHistory },
      mission: { missionSearchMap, missionMap }
    }
  } = useContext(GlobalContext);

  const { getTestIdProps } = useTestingHelper('cardlink');

  const cardlinkOffer = useMemo(
    () =>
      missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL].map(key => missionMap[key]).find(m => m?.provider.toLowerCase() === Provider.CARDLINK.toLowerCase()),
    [missionMap, missionSearchMap]
  );

  useEffect(() => {
    if (!cardlinkOffer?.callToActionUrl) {
      navigation.goBack();
    }
  }, [cardlinkOffer?.callToActionUrl, navigation]);

  const onNavigationStateChange = useCallback(
    async (event: WebViewNavigation) => {
      deps.logger.debug('onNavigationStateChange', { url: event.url });

      const matchesReturnRegex = new RegExp(enrollmentFinishUriRegex).test(event.url);
      deps.logger.debug(`URL ${matchesReturnRegex ? 'matches' : 'does not match'} a returning URL from CardLink.`);
      if (matchesReturnRegex && !navigationLoaded) {
        setNavigationLoaded(true);
        await onLoadLinkedCardsList();
        if (shouldActivateOffer) dispatch(actions.setRouteToActivateLocalOffer(routeHistory[1]));
        navigation.goBack();
      }
    },
    [deps.logger, dispatch, navigation, navigationLoaded, onLoadLinkedCardsList, routeHistory, shouldActivateOffer]
  );

  return (
    <>
      <ConnectionBanner />
      {!cardlinkOffer || isHttpError ? (
        <CriticalError />
      ) : (
        <WebView
          {...getTestIdProps('webview')}
          shouldShowLoader
          source={{ uri: cardlinkOffer.callToActionUrl }}
          retry={{ attempts: maxLoadAttempts, delayMs: attemptDelay }}
          onHttpError={() => {
            setIsHttpError(true);
          }}
          onNavigationStateChangeFN={onNavigationStateChange}
        />
      )}
    </>
  );
};

export default memo(CardLink);
