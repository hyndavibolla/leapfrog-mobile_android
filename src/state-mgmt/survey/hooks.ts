import { useContext } from 'react';

import { PromptModel } from '../../models';
import { FeatureFlag } from '../../models/general';
import { useAsyncCallback } from '../../utils/useAsyncCallback';
import { shouldShowFeature } from '_components/Flagged';
import { useErrorLog } from '../core/hooks';
import { GlobalContext } from '../GlobalState';
import { actions } from './actions';

export const useGetSurveyProfileQuestionList = () => {
  const { deps, dispatch } = useContext(GlobalContext);
  const asyncState: [() => Promise<void>, boolean, any, void] = useAsyncCallback(async () => {
    if (!shouldShowFeature(FeatureFlag.SURVEY)) return;

    deps.logger.info('Getting survey prompt questions');
    const { promptQuestions, answeredQuestions } = await deps.apiService.fetchPromptList(PromptModel.QuestionGroupName.SURVEY_PROFILE);
    dispatch(actions.setQuestionList(PromptModel.QuestionGroupName.SURVEY_PROFILE, promptQuestions));
    dispatch(actions.setAnswerList(PromptModel.QuestionGroupName.SURVEY_PROFILE, answeredQuestions));
  }, [deps.apiService.fetchMissionKeywordList]);
  useErrorLog(asyncState[2], 'There was an issue fetching survey questions');
  return asyncState;
};

export const useAnswerPrompt = () => {
  const { deps } = useContext(GlobalContext);
  const asyncState: [(promptQuestions: PromptModel.IQuestion[]) => Promise<boolean>, boolean, any, boolean] = useAsyncCallback(
    async (promptQuestions: PromptModel.IQuestion[]) => {
      if (!shouldShowFeature(FeatureFlag.SURVEY)) return;

      deps.logger.info('Updating survey prompt answers');
      deps.logger.debug('useAnswerPrompt', { promptQuestions });
      await deps.apiService.updatePromptList(promptQuestions);
      return true;
    },
    []
  );
  useErrorLog(asyncState[2], 'There was an issue updating prompt');
  return asyncState;
};
