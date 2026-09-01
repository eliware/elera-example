import { expect, jest, test } from '@jest/globals';
import { runExample } from '../../dist/src/runtime/run.js';

test('assembles the runtime dependencies', async () => {
  const db = { probe: jest.fn().mockRejectedValue(new Error('offline')), end: jest.fn().mockResolvedValue(undefined) };
  const emit = jest.fn();
  const shutdown = await runExample({ url: 'http://router', token: 'token' }, { emit, dependencies: { createDb: async () => db } });
  await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.started' }));
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', error: 'offline' }));
});
