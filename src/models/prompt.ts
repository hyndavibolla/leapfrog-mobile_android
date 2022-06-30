export enum QuestionGroupName {
  SURVEY_PROFILE = 'MAXSurveyPreQualification'
}

export interface IAnswerOption {
  answerTxt?: string;
  answerChoiceID?: string;
}

export interface IQuestion {
  promptGroupName?: QuestionGroupName;
  attributeID: string;
  questionPackageID: string;
  questionRuleID: string;
  questionTextID: string;
  questionTitle: string;
  questionLine1: string;
  questionLine2: string;
  questionLine3: string;
  questionLine4: string;
  questionLine5: string;
  answerTemplate: AnswerTemplate;
  answerChoices?: {
    answerOption: IAnswerOption[];
  };
}

export interface ISelectedAnswer {
  id?: string;
  text?: string;
}

export interface IAnswer extends IQuestion {
  selectedAnswers: ISelectedAnswer[];
}

export enum AnswerTemplate {
  SELECT = 'SingleSelect',
  MULTI = 'MultiSelect',
  TEXT = 'FreeText'
}
