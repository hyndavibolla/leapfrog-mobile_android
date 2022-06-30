import moment from 'moment';

const patternFunctions = new Map([
  [
    'Date',
    (value: string, pattern: string) => {
      return moment(value, pattern, true).isValid();
    }
  ],
  [
    'Text',
    (value: string, pattern: string) => {
      const re = new RegExp(pattern);
      return re.test(value);
    }
  ]
]);

export const patternValidationUtil = {
  isValid: (value: string, pattern: string, typePattern: string) => {
    if (pattern && typePattern) {
      const patternFunction = patternFunctions.get(typePattern);
      return patternFunction(value, pattern);
    }
    return false;
  }
};
