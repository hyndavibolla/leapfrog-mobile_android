import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import SurveyPQ, { Props } from './SurveyPQ';

import { KnownMissionSearchKey } from '../../state-mgmt/mission/state';
import { getInitialState } from '../../state-mgmt/GlobalState';
import { GeneralModel, PromptModel } from '../../models';
import { Deps } from '../../models/general';
import { Provider } from '../../models/mission';

import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { getAnswer_3, getMission_1, getQuestion_1, getQuestion_2, getQuestion_3 } from '../../test-utils/entities';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { ROUTES } from '../../constants';

describe('SurveyPQ', () => {
  console.error = () => null;
  const answer = 'answer';
  let props: Props;
  let initState: GeneralModel.IGlobalState;
  let deps: Deps;

  beforeEach(() => {
    props = {
      navigation: { navigate: jest.fn(), addListener: jest.fn().mockReturnValue(jest.fn()) } as any
    };

    deps = getMockDeps();
    deps.nativeHelperService.platform.select = config => config.ios;

    initState = getInitialState();
    initState.survey.questionGroupMap = {
      [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getQuestion_1(), getQuestion_2()]
    };
    initState.survey.answerGroupMap = {
      [PromptModel.QuestionGroupName.SURVEY_PROFILE]: []
    };
    initState.mission.missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL] = ['test12345'];
    initState.mission.missionMap = {
      ['test12345']: { ...getMission_1(), provider: Provider.SURVEY }
    };
  });

  it('should render without answers', async () => {
    const { toJSON, findAllByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);
    expect(await findAllByTestId('survey-pq-question')).toHaveLength(2);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with some answers', async () => {
    initState.survey.answerGroupMap = { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getAnswer_3()] };

    const { toJSON, findAllByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);
    expect(await findAllByTestId('survey-pq-question')).toHaveLength(3);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should successfully submit the form', async () => {
    const { getByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    fireEvent(getByTestId('select-input-input'), 'pressIn');
    fireEvent(getByTestId('select-input-picker'), 'valueChange', getQuestion_1().answerChoices.answerOption[1].answerChoiceID);
    fireEvent.press(getByTestId('select-input-confirm'));
    fireEvent.changeText(getByTestId('survey-pq-text-input'), answer);
    fireEvent.press(getByTestId('survey-pq-take-a-survey-btn'));

    await waitFor(() => {
      expect(deps.logger.debug).toBeCalledWith('useAnswerPrompt', {
        promptQuestions: [
          {
            ...getQuestion_1(),
            answerChoices: {
              answerOption: [getQuestion_1().answerChoices.answerOption[1]]
            }
          },
          {
            ...getQuestion_2(),
            answerChoices: {
              answerOption: [
                {
                  answerChoiceID: getQuestion_2().answerChoices.answerOption[0].answerChoiceID,
                  answerTxt: answer
                }
              ]
            }
          }
        ]
      });
    });
  });

  it('should successfully submit the form, get Survey URL and navigate to survey detail', async () => {
    const mission = getMission_1();

    initState.mission.missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL] = ['test123'];
    initState.mission.missionMap = { ['test456']: { ...getMission_1(), provider: Provider.SURVEY } };
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({ userId: 'userId', missions: [{ ...mission, provider: Provider.SURVEY }] });

    const { getByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    fireEvent(getByTestId('select-input-input'), 'pressIn');
    fireEvent(getByTestId('select-input-picker'), 'valueChange', getQuestion_1().answerChoices.answerOption[1].answerChoiceID);
    fireEvent.press(getByTestId('select-input-confirm'));
    fireEvent.changeText(getByTestId('survey-pq-text-input'), answer);
    fireEvent.press(getByTestId('survey-pq-take-a-survey-btn'));

    await waitFor(() => {
      expect(deps.logger.debug).toBeCalledWith('useAnswerPrompt', {
        promptQuestions: [
          {
            ...getQuestion_1(),
            answerChoices: {
              answerOption: [getQuestion_1().answerChoices.answerOption[1]]
            }
          },
          {
            ...getQuestion_2(),
            answerChoices: {
              answerOption: [
                {
                  answerChoiceID: getQuestion_2().answerChoices.answerOption[0].answerChoiceID,
                  answerTxt: answer
                }
              ]
            }
          }
        ]
      });
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.SURVEY_DETAIL, { surveyUri: mission.callToActionUrl });
    });
  });

  it('should successfully submit the form, get an error trying to find Survey URL and render the empty state container', async () => {
    initState.mission.missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL] = ['test345'];
    initState.mission.missionMap = { ['test123']: { ...getMission_1(), provider: Provider.SURVEY } };
    deps.apiService.fetchMissionList = jest.fn().mockResolvedValueOnce({ missions: [] });

    const { getByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    fireEvent(getByTestId('select-input-input'), 'pressIn');
    fireEvent(getByTestId('select-input-picker'), 'valueChange', getQuestion_1().answerChoices.answerOption[1].answerChoiceID);
    fireEvent.press(getByTestId('select-input-confirm'));
    fireEvent.changeText(getByTestId('survey-pq-text-input'), answer);
    fireEvent.press(getByTestId('survey-pq-take-a-survey-btn'));

    expect(deps.logger.debug).toBeCalledWith('useAnswerPrompt', {
      promptQuestions: [
        {
          ...getQuestion_1(),
          answerChoices: {
            answerOption: [getQuestion_1().answerChoices.answerOption[1]]
          }
        },
        {
          ...getQuestion_2(),
          answerChoices: {
            answerOption: [
              {
                answerChoiceID: getQuestion_2().answerChoices.answerOption[0].answerChoiceID,
                answerTxt: answer
              }
            ]
          }
        }
      ]
    });

    await waitFor(() => {
      expect(deps.apiService.fetchMissionList).toBeCalled();
      expect(getByTestId('survey-pq-error-empty-state-container')).toBeTruthy();
    });
  });

  it('should submit the form with errors', async () => {
    deps.apiService.updatePromptList = jest.fn().mockRejectedValueOnce('error');

    const { getByTestId, findByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    fireEvent(getByTestId('select-input-input'), 'pressIn');
    fireEvent(getByTestId('select-input-picker'), 'valueChange', getQuestion_1().answerChoices.answerOption[1].answerChoiceID);
    fireEvent.press(getByTestId('select-input-confirm'));
    fireEvent.changeText(getByTestId('survey-pq-text-input'), answer);
    fireEvent.press(getByTestId('survey-pq-take-a-survey-btn'));
    expect(await findByTestId('survey-pq-error-container')).toBeTruthy();
    fireEvent.press(getByTestId('survey-pq-error-btn'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.SURVEY_DETAIL, { surveyUri: expect.any(String) });
  });

  it('should react to an input being focused', async () => {
    initState.survey.questionGroupMap = { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getQuestion_3()] };

    const { getByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    const initialColor = getByTestId('survey-pq-text-label').props.style[1].color;
    fireEvent(getByTestId('survey-pq-text-input'), 'focus');
    const focusedColor = getByTestId('survey-pq-text-label').props.style[1].color;
    expect(focusedColor).not.toEqual(initialColor);
  });

  it('should react to an input being unfocused', async () => {
    initState.survey.questionGroupMap = { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getQuestion_3()] };

    const { getByTestId } = renderWithGlobalContext(<SurveyPQ {...props} />, deps, initState);

    const initialColor = getByTestId('survey-pq-text-label').props.style[1].color;
    fireEvent(getByTestId('survey-pq-text-input'), 'focus');
    const focusedColor = getByTestId('survey-pq-text-label').props.style[1].color;
    expect(focusedColor).not.toEqual(initialColor);
    fireEvent(getByTestId('survey-pq-text-input'), 'blur');
    const currentColor = getByTestId('survey-pq-text-label').props.style[1];
    expect(currentColor).not.toEqual(focusedColor);
  });
});
