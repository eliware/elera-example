import { expect, test } from '@jest/globals';
import { createExampleRoutingStream } from '../dist/src/runtime-dependencies.js';

test('uses the injected stream factory and supports the production default', () => {
  const injected = { close: () => undefined };
  expect(createExampleRoutingStream(() => injected, {})).toBe(injected);
  expect(createExampleRoutingStream(undefined, { endpoint: 'http://router', token: 'token', fetchBundle: async () => ({}) })).toEqual(expect.objectContaining({ close: expect.any(Function) }));
});
