import { firstDefined, firstTruthy } from './first';

describe('First', () => {
  describe('Truthy', () => {
    it('should return the first truthy value', () => {
      const expected = 'Yes';

      expect(firstTruthy('Nope', undefined, null, '', 'Yes', 'Again-no')).toEqual(expected);
    });

    it('should return the fallback if there are no truthy values', () => {
      const expected = 42;

      expect(firstTruthy(expected, undefined, 0, null, NaN)).toEqual(expected);
    });
  });

  describe('Defined', () => {
    it('should return the first defined value', () => {
      const expected = '';

      expect(firstDefined('Nope', undefined, null, '', 'Nah', 'Again-no')).toEqual(expected);
    });

    it('should return the fallback if there are no defined values', () => {
      const expected = 42;

      expect(firstDefined(expected, undefined, null)).toEqual(expected);
    });
  });
});
