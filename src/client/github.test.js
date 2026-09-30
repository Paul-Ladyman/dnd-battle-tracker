import { isNewerVersion } from './github';

describe('isNewerVersion', () => {
  test.each([
    ['5.128.0', '5.127.0'],
    ['5.127.1', '5.127.0'],
    ['6.0.0', '5.127.0'],
    ['v5.128.0', '5.127.0'],
  ])('%s is newer than %s', (candidate, current) => {
    expect(isNewerVersion(candidate, current)).toBe(true);
  });

  test.each([
    ['5.127.0', '5.127.0'],
    ['5.126.9', '5.127.0'],
    ['4.999.999', '5.127.0'],
    ['invalid', '5.127.0'],
    [null, '5.127.0'],
  ])('%s is not newer than %s', (candidate, current) => {
    expect(isNewerVersion(candidate, current)).toBe(false);
  });
});
