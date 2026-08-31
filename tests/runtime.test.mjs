import { expect, jest, test } from '@jest/globals';
import { runExample } from '../dist/src/runtime.js';

function fakeDb() {
  return {
    end: jest.fn(async () => undefined),
    getConnection: jest.fn(async () => ({ beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 1 }]) })),
    execute: jest.fn()
      .mockResolvedValueOnce([[{ node: 'reader' }]])
      .mockResolvedValueOnce([[{ Variable_name: 'wsrep_local_state_comment', Value: 'Synced' }, { Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ writer_node: 'writer' }]])
      .mockResolvedValue([[]]),
  };
}

test('starts the client with endpoint and token and shuts down cleanly', async () => {
  const emit = jest.fn();
  const db = fakeDb();
  const createClient = jest.fn(async () => db);
  const shutdown = await runExample(
    { url: 'http://router', token: 'application-token', debug: false },
    { emit, dependencies: { createDb: createClient } },
  );
  await shutdown();
  await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(createClient).toHaveBeenCalledWith({ endpoint: 'http://router', token: 'application-token' });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.started', timestamp: expect.any(String) }));
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', generatedId: 1 }));
});

test('schedules recurring probes while running', async () => {
  jest.useFakeTimers();
  const db = fakeDb();
  const shutdown = await runExample({ url: 'http://router', token: 'token' }, {
    emit: jest.fn(), dependencies: { createDb: async () => db },
  });
  jest.advanceTimersByTime(1000);
  await Promise.resolve();
  await shutdown();
  jest.useRealTimers();
  expect(db.execute).toHaveBeenCalled();
});

test('rejects a client creation failure before starting the example', async () => {
  await expect(runExample({ url: 'http://router', token: 'token' }, {
    dependencies: { createDb: async () => { throw new Error('primary.host is required'); } },
  })).rejects.toThrow('primary.host is required');
});
