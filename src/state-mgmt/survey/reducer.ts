import { IAction } from '../../models/general';
import { ACTION_TYPE } from './actions';
import { initialState, ISurveyState } from './state';

export const reducer = (state: ISurveyState = initialState, { type, payload }: IAction): ISurveyState => {
  switch (type) {
    case ACTION_TYPE.SET_QUESTION_LIST:
      return { ...state, questionGroupMap: { ...state.questionGroupMap, [payload.questionGroupName]: payload.list } };
    case ACTION_TYPE.SET_ANSWER_LIST:
      return { ...state, answerGroupMap: { ...state.answerGroupMap, [payload.questionGroupName]: payload.list } };
    default:
      return state;
  }
};
