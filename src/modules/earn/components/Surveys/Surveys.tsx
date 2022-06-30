import React, { memo, useMemo, useCallback, useEffect, useContext } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Flagged } from '_components/Flagged';
import ErrorBoundary from '_components/ErrorBoundary';
import { Title, TitleType } from '_components/Title';
import { LargeSurveyCard } from '_components/LargeSurveyCard';

import { useTestingHelper } from '_utils/useTestingHelper';

import { ROUTES, TealiumEventType, PageNames, PageType, ENV, UxObject, EventDetail, ForterActionType } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { useGetSurveyProfileQuestionList } from '_state_mgmt/survey/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';

import { FeatureFlag } from '_models/general';
import { Provider } from '_models/mission';
import { PromptModel } from '_models';

import { styles } from './styles';

export interface Props {
  focusKey: string;
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

const Surveys = ({ focusKey, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-surveys');
  const navigation = useNavigation();
  const { state } = useContext(GlobalContext);
  const { missionSearchMap, missionMap } = state.mission;
  const { trackSystemEvent } = useEventTracker();
  const [onGetSurveyQuestionList, isGettingSurveyPreQuestionList = true] = useGetSurveyProfileQuestionList();

  useEffect(() => {
    onGetSurveyQuestionList();
  }, [focusKey, onGetSurveyQuestionList]);

  const shouldShowPQButton = !isGettingSurveyPreQuestionList && !!state.survey.answerGroupMap[PromptModel.QuestionGroupName.SURVEY_PROFILE].length;

  const surveyOffer = useMemo(
    () =>
      missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL].map(key => missionMap[key]).find(m => m?.provider.toLowerCase() === Provider.SURVEY.toLowerCase()),
    [missionSearchMap, missionMap]
  );

  const onSurveyPress = useCallback(() => {
    let otherTrackingAttributes = {};
    if (shouldShowPQButton || !state.survey.questionGroupMap[PromptModel.QuestionGroupName.SURVEY_PROFILE].length) {
      otherTrackingAttributes = { event_type: PageType.SURVEY_DETAIL, exit_link: surveyOffer?.callToActionUrl };
      navigation.navigate(ROUTES.SURVEY_DETAIL, { surveyUri: surveyOffer?.callToActionUrl });
    } else {
      otherTrackingAttributes = { event_type: PageType.SURVEY_PQ };
      navigation.navigate(ROUTES.SURVEY_PQ);
    }

    trackSystemEvent(
      TealiumEventType.SURVEY_CARD_TAP,
      {
        page_name: PageNames.MAIN.EARN,
        page_type: PageType.INFO,
        address: `${ENV.SCHEME}${ROUTES.SURVEY_DETAIL}`,
        uxObject: UxObject.TILE,
        event_detail: EventDetail.OPEN,
        ...otherTrackingAttributes
      },
      ForterActionType.TAP
    );
  }, [surveyOffer, trackSystemEvent, shouldShowPQButton]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.sectionMain} {...getTestIdProps('container')}>
      <Flagged feature={FeatureFlag.SURVEY}>
        {!surveyOffer ? null : (
          <ErrorBoundary>
            <View style={styles.surveySectionHeader} {...getTestIdProps('survey-header')}>
              <Title type={TitleType.SECTION} numberOfLines={1} ellipsizeMode="tail">
                {props?.title ?? 'Surveys'}
              </Title>
              {!shouldShowPQButton ? null : (
                <TouchableHighlight onPress={() => navigation.navigate(ROUTES.SURVEY_PQ)} underlayColor="transparent" {...getTestIdProps('pq-btn')}>
                  <Title type={TitleType.SECTION} style={styles.link}>
                    Edit preferences
                  </Title>
                </TouchableHighlight>
              )}
            </View>
            <View>
              <LargeSurveyCard survey={surveyOffer} onPress={onSurveyPress} />
            </View>
          </ErrorBoundary>
        )}
      </Flagged>
    </View>
  );
};

export default memo(Surveys);
