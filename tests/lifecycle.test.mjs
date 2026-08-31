import { jest, test } from '@jest/globals';
import { registerExampleLifecycle } from '../dist/src/lifecycle.js';

test('registers and removes application lifecycle handlers', () => {
  const shutdown = jest.fn(async () => undefined);
  const lifecycle = registerExampleLifecycle(shutdown);
  lifecycle.remove();
});
