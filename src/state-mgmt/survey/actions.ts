import { PromptModel } from '../../models';

export enum ACTION_TYPE {
  SET_QUESTION_LIST = '[survey] set question list',
  SET_ANSWER_LIST = '[survey] set answer list'
}

export const actions = {
  setQuestionList: (questionGroupName: PromptModel.QuestionGroupName, list: PromptModel.IQuestion[]) => ({
    type: ACTION_TYPE.SET_QUESTION_LIST,
    payload: { questionGroupName, list }
  }),
  setAnswerList: (questionGroupName: PromptModel.QuestionGroupName, list: PromptModel.IAnswer[]) => ({
    type: ACTION_TYPE.SET_ANSWER_LIST,
    payload: { questionGroupName, list }
  })
};
