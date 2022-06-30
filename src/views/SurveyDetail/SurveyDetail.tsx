import React, { memo, useCallback, useEffect, useMemo, useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { ENV, ROUTES, ForterActionType, PageType, TealiumEventType, UxObject, EventDetail, PageNames } from '_constants';
import { WebView } from '_views/shared/WebView/WebView';
import { ConnectionBanner } from '_views/shared/ConnectionBanner';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useEventTracker, useToast } from '_state_mgmt/core/hooks';
import { ToastType } from '_views/shared/Toast';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions } from '_state_mgmt/core/actions';
import { ModalSize, ModalType } from '_views/shared/Modal';
import { LeaveSurveyModal } from '_views/shared/LeaveSurveyModal';

export interface Props {
  navigation: StackNavigationProp<any>;
  route: { params: { surveyUri: string } };
}

export const SurveyDetail = ({ navigation, route }: Props) => {
  const { MAX_LOAD_ATTEMPTS: maxLoadAttempts, ATTEMPT_DELAY_MS: attemptDelay } = ENV.WEBVIEWS;
  const { getTestIdProps } = useTestingHelper('survey-detail');
  const { trackView, trackSystemEvent } = useEventTracker();
  const { showToast } = useToast();
  const { dispatch } = useContext(GlobalContext);

  const uri = route?.params?.surveyUri;
  const source = useMemo(() => ({ uri }), [uri]);
  const retry = useMemo(() => ({ attempts: maxLoadAttempts, delayMs: attemptDelay }), [attemptDelay, maxLoadAttempts]);
  const [isShowToast, setShowToast] = useState<boolean>(true);

  const onLoadEnd = useCallback(() => {
    isShowToast && showToast({ type: ToastType.INFO, title: '🔐 Your answers are private', children: 'We do not collect or share your information.' });
    setShowToast(false);
  }, [showToast, isShowToast]);

  useEffect(() => {
    trackView(ROUTES.SURVEY_DETAIL, { iframe: uri, app_name: 'adbloom' });
  }, [trackView, uri]);

  useEffect(() => {
    const modalKey = 'leave-survey-modal';
    const onLeaveSurvey = /* istanbul ignore next */ () => {
      dispatch(actions.removeModal(modalKey));
      navigation.navigate(ROUTES.MAIN_TAB.EARN);
      trackSystemEvent(
        TealiumEventType.SURVEY_CARD_TAP,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.INFO,
          address: `${ENV.SCHEME}${ROUTES.SURVEY_DETAIL}`,
          event_type: PageType.SURVEY_DETAIL,
          uxObject: UxObject.TILE,
          event_detail: EventDetail.CLOSE
        },
        ForterActionType.TAP
      );
    };
    return navigation.addListener('beforeRemove', event => {
      event.preventDefault();
      dispatch(
        actions.addModal(modalKey, {
          size: ModalSize.MEDIUM,
          type: ModalType.BOTTOM,
          visible: true,
          children: <LeaveSurveyModal onLeaveSurvey={onLeaveSurvey} onCancel={/* istanbul ignore next */ () => dispatch(actions.removeModal(modalKey))} />
        })
      );
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ConnectionBanner />
      <WebView {...getTestIdProps('webview')} shouldShowLoader={true} source={source} retry={retry} onLoad={onLoadEnd} />
    </>
  );
};

export default memo(SurveyDetail);
