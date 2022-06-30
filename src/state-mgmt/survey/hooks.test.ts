import { act } from '@testing-library/react-hooks';

import { getMockDeps } from '../../test-utils/getMockDeps';
import { Deps, FeatureFlag } from '../../models/general';
import { actions } from './actions';
import { useAnswerPrompt, useGetSurveyProfileQuestionList } from './hooks';
import { renderWrappedHook } from '../../test-utils/renderWrappedHook';
import { PromptModel } from '../../models';
import { getAnswer_1, getAnswer_2, getAnswer_3, getQuestion_1, getQuestion_2, getQuestion_3 } from '../../test-utils/entities';
import { ENV } from '../../constants';

describe('survey hooks', () => {
  let deps: Deps;
  let ignoredFeatureFlags: FeatureFlag[];

  beforeAll(() => {
    ignoredFeatureFlags = ENV.IGNORED_FEATURE_LIST;
  });

  beforeEach(() => {
    deps = getMockDeps();
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  afterAll(() => {
    ENV.IGNORED_FEATURE_LIST = ignoredFeatureFlags;
  });

  describe('useGetSurveyProfileQuestionList', () => {
    it('should fetch and return the survey profile question list', async () => {
      const { result, mockReducer } = renderWrappedHook(() => useGetSurveyProfileQuestionList(), deps);
      await act(async () => {
        await (result.current[0] as any)();
        expect(deps.apiService.fetchPromptList).toBeCalled();
        expect(mockReducer).toBeCalledWith(
          expect.any(Object),
          actions.setQuestionList(PromptModel.QuestionGroupName.SURVEY_PROFILE, [getQuestion_1(), getQuestion_2(), getQuestion_3()])
        );
        expect(mockReducer).toBeCalledWith(
          expect.any(Object),
          actions.setAnswerList(PromptModel.QuestionGroupName.SURVEY_PROFILE, [getAnswer_1(), getAnswer_2(), getAnswer_3()])
        );
      });
    });

    it('should not make any calls if surveys are disabled by feature flag', async () => {
      ENV.IGNORED_FEATURE_LIST = [...ignoredFeatureFlags, FeatureFlag.SURVEY];
      const { result, mockReducer } = renderWrappedHook(() => useGetSurveyProfileQuestionList(), deps);
      const [getSurveyQuestions, , , surveyQuestions] = result.current;
      await act(async () => {
        await (getSurveyQuestions as any)();
      });
      expect(mockReducer).not.toBeCalled();
      expect(deps.apiService.fetchPromptList).not.toBeCalled();
      expect(surveyQuestions).toBe(undefined);
    });
  });

  describe('useAnswerPrompt', () => {
    it('should update prompt', async () => {
      const { result } = renderWrappedHook(() => useAnswerPrompt(), deps);
      await act(async () => {
        await (result.current[0] as any)([getAnswer_1()]);
        expect(deps.apiService.updatePromptList).toBeCalledWith([getAnswer_1()]);
      });
    });

    it('should not make any API calls if surveys are disabled by feature flag', async () => {
      ENV.IGNORED_FEATURE_LIST = [...ignoredFeatureFlags, FeatureFlag.SURVEY];
      const { result, mockReducer } = renderWrappedHook(() => useAnswerPrompt(), deps);
      const [updateAnswers] = result.current;
      const answers = [getAnswer_1()];
      await act(async () => await updateAnswers(answers));
      expect(deps.apiService.updatePromptList).not.toBeCalled();
      expect(mockReducer).not.toBeCalled();
    });
  });
});
