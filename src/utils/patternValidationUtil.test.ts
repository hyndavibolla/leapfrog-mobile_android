import { patternValidationUtil } from './patternValidationUtil';

describe('patternValidationUtil', () => {
  it('should validate text pattern', () => {
    expect(patternValidationUtil.isValid('12345', '\\d{5}', 'Text')).toEqual(true);
  });

  it('should validate date pattern', () => {
    expect(patternValidationUtil.isValid('03-15-2021', 'MM-DD-YYYY', 'Date')).toEqual(true);
  });
});
