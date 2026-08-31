import { expect, test } from '@jest/globals';
import { readConfiguration } from '../../dist/src/configuration/read.js';

test('reads the documented endpoint and token contract', () => {
  expect(readConfiguration({ ELERA_API_URL: 'http://router', ELERA_API_TOKEN: 'token', ELERA_DEBUG: '1' })).toEqual({ url: 'http://router', token: 'token', debug: true });
});
