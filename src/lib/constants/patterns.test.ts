/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AddressPattern,
  GithubPullRequestPattern,
  IntegerPattern,
  NumberPattern,
  SignedIntegerPattern,
  UrlPattern,
} from '@/src/lib/constants/patterns';

describe('Success cases for Number Pattern', () => {
  const successes = [
    '1',
    '3',
    '012345678900987654321',
    '0987654321234567890.0987654321234567890',
    '1.0',
    '3.14159',
    '0987654321234567890.0987654321234567890',
  ];
  testSuccesses(NumberPattern, successes);
});

describe('Failure cases for Number Pattern', () => {
  const failures = [
    'Not a number',
    'NaN',
    '-1',
    '-3.14159',
    ' 2',
    '3 ',
    '',
    '1 3',
  ];
  testFailures(NumberPattern, failures);
});

describe('Succes cases for Integer Pattern', () => {
  const successes = ['1234567890', '0987654321', '1'];
  testSuccesses(IntegerPattern, successes);
});

describe('Failures cases for Integer Pattern', () => {
  const failures = [
    '', // empty string
    ' ', // only space
    ' 123456789', // space at start
    '12345 6789', // space at middle
    '123456789 ', // space at end
    '-123456789 ', // negative number
  ];
  testFailures(IntegerPattern, failures);
});

describe('Succes cases for Signed Integer Pattern', () => {
  const successes = [
    '1234567890',
    '0987654321',
    '1',
    '-1234567890',
    '-0987654321',
    '-1',
    '+1234567890',
    '+0987654321',
    '+1',
  ];
  testSuccesses(SignedIntegerPattern, successes);
});

describe('Failures cases for Signed Integer Pattern', () => {
  const failures = [
    '', // empty string
    ' ', // only space
    ' 123456789', // space at start
    '12345 6789', // space at middle
    '123456789 ', // space at end
    '--123456789 ', // double sign number
    '++1234567890',
  ];
  testFailures(SignedIntegerPattern, failures);
});

describe('Success cases for Address Pattern', () => {
  const successes = [
    '0xf80A4cbdA4Fb35d59B40d9aD54C198280bBa1B36',
    '0xED45FF9490723c2fb4A354e4B554c357604eA73C',
    '0xdAfAB237B65cf37B3aAB7aF251C99764998e5E97',
    '0xaF7E68bCb2Fc7295492A00177f14F59B92814e70',
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f',
  ];
  testSuccesses(AddressPattern, successes);
});

describe('Failure cases for Address Pattern', () => {
  const failures = [
    'Not an address',
    '7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', // No 0x leader
    'null',
    '', //empty string
    ' 0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f', //space at beginning
    '0x7f2B04dFE3a529BB6527c F4C33F87F5A87b4AB2f', //space at middle
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f ', // space at end
    '0x7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f7f2B04dFE3a529BB6527cF4C33F87F5A87b4AB2f09876543212345678909876543212345678909897654433212', // too long
    '0x7f2B04', // too short
    '0x7f2z04dZE3a529BB6z27cF4C33FZ7F5A87b4zB2f', //contains z and Z
  ];
  testFailures(AddressPattern, failures);
});

describe('Succes cases for Url Pattern', () => {
  const successes = [
    'http://MVSXX.COMPANY.COM:04445/CICSPLEXSM//JSMITH/VIEW/OURTASK?A_PRIORITY=200&O_PRIORITY=GT',
    'http://MVSXX.COMPANY.COM:04445/CICSPLEXSM//JSMITH/VIEW/OURWLMAWAOR.TABLE1?P_WORKLOAD=WLDPAY01',
    'https://www.example.com/123',
    'example.nl/example',
    'http://example.com',
    'example.com',
  ];
  testSuccesses(UrlPattern, successes);
});

describe('Failures cases for Url Pattern', () => {
  const failures = [
    '', // empty string
    ' ', //Only space
    ' www.example.com/123', // space at start
    'www.examp le.com/123', // space at middle
    'www.example.com/123 ', // space at end
    'www.example.com/😎', // invalid url character 😎
  ];
  testFailures(UrlPattern, failures);
});

describe('Succes cases for Github pull request Pattern', () => {
  const successes = [
    'https://github.com/orgname/reponame/pull/2609',
    'https://github.com/orgname/reponame/pull/1',
    'https://github.com/SecureSECODAO/dao-webapp/pull/72',
  ];
  testSuccesses(GithubPullRequestPattern, successes);
});

describe('Failures cases for Github pull request Pattern', () => {
  const failures = [
    '', // empty string
    ' ', //Only space
    ' https://github.com/orgname/reponame/pull/123', // space at start
    'https://github.com /orgname/reponame/pull/123', // space at middle
    'https://github.com/orgname/reponame/pull/123 ', // space at end
    'https://github.com/orgname/pull/123 ', // missing repo name
    'https://github.com/orgname/reponame/123 ', // missing pull
    'https://github.com/orgname/reponame/pull', // missing pull request number
    'https://github.com/orgname/reponame/pull/123/', // '/' at end
  ];
  testFailures(GithubPullRequestPattern, failures);
});

function testSuccesses(pattern: RegExp, successes: string[]) {
  test.each(successes)('"%s" should match', (value) => {
    expect(pattern.test(value)).toBe(true);
  });
}

function testFailures(pattern: RegExp, failures: string[]) {
  test.each(failures)('"%s" should fail', (value) => {
    expect(pattern.test(value)).toBe(false);
  });
}
