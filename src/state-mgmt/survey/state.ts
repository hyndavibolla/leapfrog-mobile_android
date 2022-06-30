import { PromptModel } from '../../models';

export interface ISurveyState {
  questionGroupMap: Record<string, PromptModel.IQuestion[]>;
  answerGroupMap: Record<string, PromptModel.IAnswer[]>;
}

export const initialState: ISurveyState = {
  questionGroupMap: Object.values(PromptModel.QuestionGroupName).reduce((total, key) => ({ ...total, [key]: [] }), {}),
  answerGroupMap: Object.values(PromptModel.QuestionGroupName).reduce((total, key) => ({ ...total, [key]: [] }), {})
};
