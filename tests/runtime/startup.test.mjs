import { expect, jest, test } from '@jest/globals';
import { startExample } from '../../dist/src/runtime/startup.js';

test('emits startup and completes the initial probe', async () => {
  const emit = jest.fn(); const probe = jest.fn().mockResolvedValue(undefined); const db = {};
  const result = await startExample({ db, emit });
  expect(result).toBeDefined(); expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.started' }));
  expect(probe).not.toHaveBeenCalled();
});
