import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { getAnswer_1, getQuestion_1 } from '../../test-utils/entities';
import { PromptModel } from '../../models';

describe('survey reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_QUESTION_LIST', () => {
    expect(reducer(initialState, actions.setQuestionList(PromptModel.QuestionGroupName.SURVEY_PROFILE, [getQuestion_1()]))).toEqual({
      ...initialState,
      questionGroupMap: { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getQuestion_1()] }
    });
  });

  it('should return a new state ACTION_TYPE.SET_ANSWER_LIST', () => {
    expect(reducer(initialState, actions.setAnswerList(PromptModel.QuestionGroupName.SURVEY_PROFILE, [getAnswer_1()]))).toEqual({
      ...initialState,
      answerGroupMap: { [PromptModel.QuestionGroupName.SURVEY_PROFILE]: [getAnswer_1()] }
    });
  });
});
