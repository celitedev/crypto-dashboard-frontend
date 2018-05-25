/**
 * Test isValidStringOnly
 */

import isValidStringOnly from '../isValidStringOnly';

describe('isValidStringOnly', () => {
  describe('', () => {
    it('return true for empty code', () => {
      expect(isValidStringOnly('')).toEqual(true);
    });

    it('return false for string with numbers', () => {
      expect(isValidStringOnly('hello1')).toEqual(false);
    });

    it('return false for string with special characters', () => {
      expect(isValidStringOnly('hello@')).toEqual(false);
    });

    it('return true for string only', () => {
      expect(isValidStringOnly('Kosta')).toEqual(true);
    });
  });
});
