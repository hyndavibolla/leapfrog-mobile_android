import { normalizeKeys } from './normalizeKeys';

describe('normalizeKeys', () => {
  it('should return a primitive', () => {
    expect(normalizeKeys(1)).toEqual(1);
  });

  it('should return a normalized simple object with odd ids', () => {
    expect(normalizeKeys({ id: 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ ID: 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ unique_ID: 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ unique_id: 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ 'unique-id': 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ 'straight from hell iD': 1 })).toEqual({ id: 1 });
    expect(normalizeKeys({ uuid: 1 })).toEqual({ uuid: 1 });
  });

  it('should return a normalized combination of odd keys', () => {
    expect(normalizeKeys({ snake_case: 2, 'dash-case': 3, PascalCase: 4, 'weird case': 5, id: 6 })).toEqual({
      snakeCase: 2,
      dashCase: 3,
      pascalCase: 4,
      weirdCase: 5,
      id: 6
    });
  });

  it('should return normalized nested items', () => {
    expect(
      normalizeKeys({
        this_thing_id: 6,
        usa: [{ snake_case: { 'dash-case': 3 } }, { PascalCase: ['weird case'] }]
      })
    ).toEqual({
      id: 6,
      usa: [{ snakeCase: { dashCase: 3 } }, { pascalCase: ['weird case'] }]
    });
  });
});
