import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import Surveys, { Props } from './Surveys';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Provider } from '_models/mission';
import { Deps, IGlobalState } from '_models/general';
import { PromptModel } from '_models';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { getAnswer_1, getMission_1, getQuestion_1, getQuestion_2 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { createUUID } from '_utils/create-uuid';

import { ROUTES } from '_constants';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: mockNavigate })
}));

describe('Surveys', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();

    initialState.mission.missionSearchMap[KnownMissionSearchKey.EXCEPTIONAL] = ['test12345'];
    initialState.mission.missionMap = { ['test12345']: { ...getMission_1(), provider: Provider.SURVEY } };
    initialState.survey.questionGroupMap = { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getQuestion_1(), getQuestion_2()] };
    initialState.survey.answerGroupMap = { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [] };
    props = {
      focusKey: createUUID()
    };

    deps.apiService.fetchMissionList = jest.fn().mockImplementationOnce(({ listType }) => {
      return {
        userId: 'userId',
        missions: [
          {
            ...getMission_1(),
            provider: Provider.SURVEY
          }
        ],
        listType
      };
    });
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<Surveys {...props} />);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should navigate to survey pq when a survey card was pressed', async () => {
    deps.apiService.fetchPromptList = jest.fn().mockImplementationOnce(() => {
      return { answeredQuestions: [], promptQuestions: [getQuestion_1()] };
    });

    const { findByTestId } = renderWithGlobalContext(<Surveys {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('large-survey-card-container'));
    expect(mockNavigate).toBeCalledWith(ROUTES.SURVEY_PQ);
  });

  it('should have a pressable survey card when PQ is NOT needed', async () => {
    deps.apiService.fetchPromptList = jest.fn().mockImplementationOnce(() => {
      return { answeredQuestions: [getAnswer_1()], promptQuestions: [getQuestion_1()] };
    });

    const { findByTestId } = renderWithGlobalContext(<Surveys {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('large-survey-card-container'));
    expect(mockNavigate).toBeCalledWith(ROUTES.SURVEY_DETAIL, {
      surveyUri: getMission_1().callToActionUrl
    });
  });

  it('should have an edit pq questions when there are any answered question to edit', async () => {
    deps.apiService.fetchPromptList = jest.fn().mockImplementationOnce(() => {
      return { answeredQuestions: [getAnswer_1()], promptQuestions: [getQuestion_1()] };
    });

    const { findByTestId } = renderWithGlobalContext(<Surveys {...props} />, deps, initialState);
    fireEvent.press(await findByTestId('earn-main-surveys-pq-btn'));
    expect(mockNavigate).toBeCalledWith(ROUTES.SURVEY_PQ);
  });

  it('should NOT have a edit pq questions when there is not any answered question to edit', async () => {
    deps.apiService.fetchPromptList = jest.fn().mockImplementationOnce(() => {
      return { answeredQuestions: [], promptQuestions: [getQuestion_1()] };
    });

    const { queryByTestId } = renderWithGlobalContext(<Surveys {...props} />, deps, initialState);

    await waitFor(() => {
      expect(queryByTestId('earn-main-surveys-pq-btn')).toBeNull();
    });
  });
});
