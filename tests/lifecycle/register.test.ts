import { jest, test } from '@jest/globals';
import { registerExampleLifecycle } from '../../dist/src/lifecycle/register.js';

test('registers lifecycle handling and exposes removal', () => {
  const lifecycle = registerExampleLifecycle(jest.fn(async () => undefined));
  lifecycle.remove();
});
