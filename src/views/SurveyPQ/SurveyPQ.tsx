import React, { memo, useCallback, useState, useEffect, useContext, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, ScrollView, Text } from 'react-native';
import SurveyEmptyIcon from '../../assets/shared/surveyEmptyIcon.svg';

import { styles } from './styles';
import { Button } from '../shared/Button';
import { useTestingHelper } from '../../utils/useTestingHelper';
import { Input } from '../shared/Input';
import { Title, TitleType } from '../shared/Title';
import { ENV, ForterActionType, PageType, ROUTES, TealiumEventType, UxObject, EventDetail, PageNames } from '../../constants';
import { useEventTracker } from '../../state-mgmt/core/hooks';
import { GlobalContext } from '../../state-mgmt/GlobalState';
import { PromptModel } from '../../models';
import { SelectInput } from '../shared/SelectInput';
import { useAnswerPrompt } from '../../state-mgmt/survey/hooks';
import { EmptyState } from '../shared/EmptyState';
import { KnownMissionSearchKey } from '../../state-mgmt/mission/state';
import { MissionListType, Provider } from '../../models/mission';
import { useMissionFreeSearch } from '../../state-mgmt/mission/hooks';

export interface Props {
  navigation: StackNavigationProp<any>;
}

const EmptyStateComponent = (
  <EmptyState
    visible={true}
    Icon={SurveyEmptyIcon}
    title="Whoops! We can't load your info now"
    subtitleLine1={`Please try again in a few minutes.${'\n'}In the meantime, explore all the ways to earn points everyday in the 🚀 Earn section!${'\n'}`}
    subtitleLine2="Still, you can take Surveys that won´t match exactly with your profile."
  />
);

/** @todo multi select responses */
export const SurveyPQ = ({ navigation }: Props) => {
  const [onMissionFreeSearch] = useMissionFreeSearch();

  const [inputFocused, setInputFocused] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  const { getTestIdProps } = useTestingHelper('survey-pq');
  const { state } = useContext(GlobalContext);
  const { missionSearchMap, missionMap } = state.mission;
  const questionList = useMemo(
    () => [
      ...state.survey.questionGroupMap[PromptModel.QuestionGroupName.SURVEY_PROFILE],
      ...state.survey.answerGroupMap[PromptModel.QuestionGroupName.SURVEY_PROFILE]
    ],
    [state.survey]
  );

  const answerList = state.survey.answerGroupMap[PromptModel.QuestionGroupName.SURVEY_PROFILE];
  const { trackSystemEvent } = useEventTracker();
  const [formValue, setFormValue] = useState<Record<string /** attributeID */, PromptModel.ISelectedAnswer>>({});
  const [formValidValue, setFormValidValue] = useState<Record<string /** attributeID */, boolean>>({});

  const [onUpdatePrompt, isUpdatingPrompt, errorUpdating, successUpdatingPrompt] = useAnswerPrompt();

  const surveyOffer = useMemo(
    () =>
      missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL].map(key => missionMap[key]).find(m => m?.provider.toLowerCase() === Provider.SURVEY.toLowerCase()),
    [missionSearchMap, missionMap]
  );

  const trackEvent = useCallback(
    (attributes: Record<string, any>) =>
      trackSystemEvent(
        TealiumEventType.SURVEY_CARD_TAP,
        {
          page_name: PageNames.MAIN.EARN,
          page_type: PageType.INFO,
          event_type: PageType.SURVEY_PQ,
          uxObject: UxObject.TILE,
          ...attributes
        },
        ForterActionType.TAP
      ),
    [trackSystemEvent]
  );

  const onTakeASurveyPress = useCallback(() => {
    const promptQuestions = questionList.map(question => ({
      ...question,
      answeredQuestion: undefined,
      selectedAnswers: undefined,
      answerChoices: {
        answerOption: [{ answerChoiceID: formValue[question.attributeID]?.id, answerTxt: formValue[question.attributeID]?.text }].filter(
          a => !a.answerChoiceID || a.answerTxt
        )
      }
    }));

    onUpdatePrompt(promptQuestions);
    trackEvent({
      address: `${ENV.SCHEME}${ROUTES.SURVEY_DETAIL}`,
      event_detail: EventDetail.OPEN
    });
  }, [questionList, onUpdatePrompt, trackEvent, formValue]);

  const isFormInvalid = useCallback(() => {
    return !questionList.every(question => formValidValue[question.attributeID]);
  }, [questionList, formValidValue]);

  useEffect(() => {
    return () => {
      trackEvent({
        address: `${ENV.SCHEME}${ROUTES.SURVEY_PQ}`,
        event_detail: EventDetail.CLOSE
      });
    };
  }, [trackEvent]);

  const onAnswer = (attributeID: string, answer: PromptModel.ISelectedAnswer) => setFormValue(prev => ({ ...prev, [attributeID]: answer }));

  const onTakeASurveyAnywayPress = () => navigation.navigate(ROUTES.SURVEY_DETAIL, { surveyUri: surveyOffer?.callToActionUrl });

  const getSurveyUrlAndNavigate = useCallback(async () => {
    const [res] = await onMissionFreeSearch(KnownMissionSearchKey.EXCEPTIONAL, MissionListType.EXCEPTIONAL);
    if (res?.callToActionUrl) navigation.navigate(ROUTES.SURVEY_DETAIL, { surveyUri: res?.callToActionUrl });
    else setIsEmptyState(true);
  }, [navigation, onMissionFreeSearch]);

  useEffect(() => {
    setFormValue(answerList.reduce((total, answer) => ({ ...total, [answer.attributeID]: answer?.selectedAnswers && answer?.selectedAnswers[0] }), {}));
    setIsUpdating(true);
  }, [answerList]);

  useEffect(() => {
    if (successUpdatingPrompt) {
      if (surveyOffer?.callToActionUrl) navigation.navigate(ROUTES.SURVEY_DETAIL, { surveyUri: surveyOffer?.callToActionUrl });
      else getSurveyUrlAndNavigate();
    }
  }, [successUpdatingPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (errorUpdating) {
    return (
      <View style={styles.container} {...getTestIdProps('error-container')}>
        {EmptyStateComponent}
        <View style={styles.footer}>
          <View>
            <Button
              disabled={isUpdatingPrompt}
              innerContainerStyle={[styles.outerButton, styles.innerButton]}
              textStyle={styles.buttonText}
              onPress={onTakeASurveyAnywayPress}
              {...getTestIdProps('error-btn')}
            >
              Take a survey anyways!
            </Button>
          </View>
        </View>
      </View>
    );
  }

  if (isEmptyState) {
    return (
      <View style={styles.container} {...getTestIdProps('error-empty-state-container')}>
        {EmptyStateComponent}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} {...getTestIdProps('container')}>
      <View style={styles.content}>
        <Title type={TitleType.HEADER}>Welcome to Surveys 🎉</Title>
        <Text style={styles.subtitle}>First, we need some information so we can find the best surveys that match you!</Text>
        {questionList.map(question => {
          const answerId = formValue[question.attributeID]?.id || formValue[question.attributeID]?.text;
          const answerText = formValue[question.attributeID]?.text;
          const placeholder = question.questionLine5;
          const [typePattern, pattern] = question.questionLine4.split('=');
          return (
            <View
              key={question.attributeID}
              style={[
                styles.fieldContainer,
                [PromptModel.AnswerTemplate.SELECT, PromptModel.AnswerTemplate.MULTI].includes(question.answerTemplate) && { zIndex: 15 }
              ]}
              {...getTestIdProps('question')}
            >
              <Text {...getTestIdProps('text-label')} style={[styles.fieldLabel, inputFocused === question.attributeID && styles.fieldLabelBlue]}>
                {question.questionTitle}
                {!(question.answerTemplate === PromptModel.AnswerTemplate.TEXT && answerText) ? null : (
                  <Text style={styles.fieldLabel}>{` (${placeholder})`}</Text>
                )}
              </Text>
              {(() => {
                switch (question.answerTemplate) {
                  case PromptModel.AnswerTemplate.SELECT:
                  case PromptModel.AnswerTemplate.MULTI:
                    return (
                      <SelectInput
                        selectedOption={{ value: answerId, label: answerText }}
                        onChange={option => {
                          onAnswer(question.attributeID, { id: option.value, text: option.label });
                          setFormValidValue(prev => ({ ...prev, [question.attributeID]: true }));
                        }}
                        optionList={question.answerChoices?.answerOption?.map(o => ({ label: o.answerTxt, value: o.answerChoiceID }))}
                        placeholder={placeholder}
                        sheetContainerStyle={styles.sheetContainer}
                      />
                    );
                  case PromptModel.AnswerTemplate.TEXT:
                  default:
                    return (
                      <Input
                        value={answerText}
                        onChangeValidate={(value, isValid) => {
                          onAnswer(question.attributeID, { id: question.answerChoices?.answerOption[0]?.answerChoiceID, text: value });
                          setFormValidValue(prev => ({ ...prev, [question.attributeID]: isValid }));
                        }}
                        isModeUpdate={isUpdating}
                        onFocus={() => setInputFocused(question.attributeID)}
                        onBlur={() => setInputFocused(null)}
                        placeholder={placeholder}
                        pattern={pattern}
                        typePattern={typePattern}
                        errorText={`Invalid ${question.questionTitle.toLowerCase()}`}
                        {...getTestIdProps('text-input')}
                      />
                    );
                }
              })()}
            </View>
          );
        })}

        <Text style={styles.legend}>🔐 Your data and answers are confidential. We do not collect or share identifying information about you</Text>
      </View>
      <View style={styles.footer}>
        <View>
          <Button
            disabled={isUpdatingPrompt || isFormInvalid()}
            innerContainerStyle={[styles.outerButton, styles.innerButton]}
            textStyle={styles.buttonText}
            onPress={onTakeASurveyPress}
            {...getTestIdProps('take-a-survey-btn')}
          >
            Take a survey!
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(SurveyPQ);
