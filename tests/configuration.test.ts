import { expect, test } from '@jest/globals';
import { readConfiguration } from '../src/configuration.ts';

test('validates required configuration and applies safe defaults', () => {
  expect(readConfiguration({ ELERA_API_ENDPOINT: 'http://router', ELERA_API_TOKEN: 'token' })).toEqual({ endpoint: 'http://router', token: 'token', debug: false });
});

test('reports all missing configuration values', () => {
  expect(() => readConfiguration({})).toThrow('endpoint, token');
});
