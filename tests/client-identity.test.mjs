import { expect, test } from '@jest/globals';
import { createClientIdentity } from '../dist/src/client-identity.js';

test('creates and validates a generated Snowflake identity', () => {
  expect(createClientIdentity(() => 'client-1')).toBe('client-1');
  expect(() => createClientIdentity(() => '')).toThrow('non-empty string');
  expect(() => createClientIdentity(() => null)).toThrow('non-empty string');
});
