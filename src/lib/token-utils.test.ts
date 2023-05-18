/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { bigIntToFloat, toAbbreviatedTokenAmount } from '@/src/lib/token-utils';

test('bigIntToFloat correct on 12345678n, decimal 4', () => {
  expect(bigIntToFloat(12345678n, 4)).toBe(1234.5678);
  expect(bigIntToFloat(12345678n, 4)).not.toBe(12345.678);
});

test('bigIntToFloat correct on 123456781234567812345678n, decimal 18', () => {
  expect(bigIntToFloat(123456781234567812345678n, 18)).toBeCloseTo(
    123456.78123456781
  );
});

test('bigIntToFloat correct on 1n, decimal 0 (ERC721)', () => {
  expect(bigIntToFloat(1n, 0)).toBe(1);
});

// Some tests for toAbbreviatedTokenAmount are included, to test functionality that we
// added ourselves. Other functionality of this function is presumed to be correct,
// as it was taken from Aragon App.

test('toAbbreviatedTokenAmount to correctly handle very large numbers', () => {
  expect(
    toAbbreviatedTokenAmount({
      value: 123456789101112131415161n,
      tokenDecimals: 4,
      displayDecimals: 21,
    })
  ).toBe('12*10^18');
});

test('toAbbreviatedTokenAmount to correctly handle displayDecimals > 20', () => {
  expect(
    toAbbreviatedTokenAmount({
      value: 12345678n,
      tokenDecimals: 4,
      displayDecimals: 21,
    })
  ).toHaveLength(25); // 1234.56789... (20 decimal digits + 1 dot + 4 digits before dot)
});

test('toAbbreviatedTokenAmount to correctly handle displayDecimals < 0 and round the result', () => {
  expect(
    toAbbreviatedTokenAmount({
      value: 12345678n,
      tokenDecimals: 4,
      displayDecimals: -1,
    })
  ).toBe('1235');
});
